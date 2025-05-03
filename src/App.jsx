import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import queryString from 'query-string';

function App() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Get the URL parameters (both query and hash)
    const queryParams = queryString.parse(window.location.search);
    const hashParams = queryString.parse(window.location.hash);
    const params = { ...queryParams, ...hashParams };

    const { code, state, error } = params;

    // If there was an error in OAuth process
    if (error) {
      console.error("❌ Error:", error);
      setErrorMessage("OAuth failed: " + error);
      setLoading(false);
      return;
    }

    // If we have an authorization code, we need to exchange it for an access token
    if (code) {
      console.log("🔁 OAuth Code:", code);
      exchangeTokenFromCode(code);
    }
  }, []);

  // Function to exchange the code for an access token
  const exchangeTokenFromCode = async (code) => {
    console.log(code)
    try {
      const body = queryString.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: 'OBDC4736C5',
        client_secret: 'bf3f87ea3d41be15b3bf',
        redirect_uri: 'https://digilockerauth.netlify.app/',
      });

      const response = await axios.post(
        'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token', // Endpoint for token exchange
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const data = response.data;
      console.log("✅ Token Received:", data);
      setAccessToken(data.access_token);  // Store the access token in the state
      setLoading(false);  // Stop the loading spinner
    } catch (error) {
      console.error("❌ Token Exchange Error:", error.response?.data || error.message);
      setErrorMessage("Failed to exchange code for token");
      setLoading(false);
    }
  };

  // Handle loading state and error messages
  if (loading) {
    return (
      <div className="loading">
        <h2 style={{ color: "#1f4e78" }}>Processing DigiLocker Login.....</h2>
        <p style={{ color: "#1f4e7880" }}>
          Check console for OAuth code and redirecting to app.
        </p>
      </div>
    );
  }

  // If there was an error
  if (errorMessage) {
    return (
      <div className="error">
        <h2 style={{ color: "#f44336" }}>Error:</h2>
        <p style={{ color: "#f4433680" }}>{errorMessage}</p>
      </div>
    );
  }

  // If we have an access token, show it
  if (accessToken) {
    return (
      <div className="success">
        <h2 style={{ color: "#4caf50" }}>Successfully Authenticated!</h2>
        <p style={{ color: "#4caf5080" }}>Access Token:</p>
        <pre>{accessToken}</pre>
      </div>
    );
  }

  // Default fallback if something unexpected happens
  return (
    <div className="fallback">
      <h2 style={{ color: "#1f4e78" }}>Unexpected State</h2>
      <p>Please check console for more information.</p>
    </div>
  );
}

export default App;
