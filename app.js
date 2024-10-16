// app.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const app = express();

// Set up EJS for templating
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set up sessions
app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add these constants at the top of app.js
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/teamsnap/callback';

// Route to initiate OAuth flow
app.get('/auth/teamsnap', (req, res) => {
  const authorizationEndpoint = 'https://auth.teamsnap.com/oauth/authorize';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
  });

  // Redirect the user to the TeamSnap authorization page
  res.redirect(`${authorizationEndpoint}?${params.toString()}`);
});

// Route to display a form for the user to input the authorization code
app.get('/auth/teamsnap/code', (req, res) => {
  res.render('code_input');
});

// Route to handle the form submission and exchange the code for a token
app.post('/auth/teamsnap/code', async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.send('Error: No code provided');
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://auth.teamsnap.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI, // OOB URN
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Store the access token in the session
    req.session.accessToken = accessToken;

    // Optionally, fetch user info from TeamSnap API
    const userResponse = await axios.get('https://api.teamsnap.com/v3/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // Render a success page with user info
    res.render('success', { user: userData });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.send('Error exchanging code for token');
  }
});

// Callback route to handle the response from TeamSnap
app.get('/auth/teamsnap/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send('Error: No code received');
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://auth.teamsnap.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Store the access token in the session
    req.session.accessToken = accessToken;

    // Optionally, fetch user info from TeamSnap API
    const userResponse = await axios.get('https://api.teamsnap.com/v3/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // Render a success page with user info
    res.render('success', { user: userData });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response.data);
    res.send('Error exchanging code for token');
  }
});