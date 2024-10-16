# TeamSnap OAuth Test App

This is a simple Express.js application that demonstrates OAuth 2.0 authentication with TeamSnap.

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)
- A TeamSnap account and OAuth application credentials

## Setup

1. Clone this repository to your local machine.

2. Install the required dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:
   ```
   CLIENT_ID=your_teamsnap_client_id
   CLIENT_SECRET=your_teamsnap_client_secret
   REDIRECT_URI=http://localhost:3000/auth/teamsnap/callback
   ```
   Replace `your_teamsnap_client_id` and `your_teamsnap_client_secret` with your actual TeamSnap OAuth application credentials.

4. Make sure your TeamSnap OAuth application settings include the correct redirect URI (http://localhost:3000/auth/teamsnap/callback).

## Running the Application

1. Start the server:
   ```
   npm start
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Click the "Sign in with TeamSnap" button to initiate the OAuth flow.

4. After authorizing the application on TeamSnap, you will be redirected back to the application where you can see your user information.

## File Structure

- `app.js`: The main Express.js application file
- `views/`: Directory containing EJS templates
  - `index.ejs`: Home page
  - `code_input.ejs`: Page for manual code input (if needed)
  - `success.ejs`: Success page displaying user information

## Notes

- This application uses express-session for session management. In a production environment, you should use a more robust session store.
- Error handling is minimal in this example. In a production application, you should implement more comprehensive error handling and logging.