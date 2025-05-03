import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import queryString from 'query-string';

function App() {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const [error, setError] = useState(null);

  // Configuration - should use environment variables in production
  const config = {
    clientId: 'OBDC4736C5',
    clientSecret: 'bf3f87ea3d41be15b3bf',
    redirectUri: window.location.origin + window.location.pathname,
    tokenEndpoint: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token',
    authEndpoint: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize'
  };

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    
    // If there's an error in the URL params
    if (params.error) {
      setError(`Authentication failed: ${params.error_description || params.error}`);
      setLoading(false);
      cleanUrl();
      return;
    }

    // If we have an authorization code
    if (params.code) {
      exchangeToken(params.code);
      return;
    }

    // If no code and no error, initiate login
    setLoading(false);
  }, []);

  const exchangeToken = async (code) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokenData = new URLSearchParams();
      tokenData.append('grant_type', 'authorization_code');
      tokenData.append('code', code);
      tokenData.append('redirect_uri', config.redirectUri);

      const response = await axios.post(
        config.tokenEndpoint,
        tokenData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: config.clientId,
            password: config.clientSecret
          }
        }
      );

      setAuthData(response.data);
      cleanUrl();
    } catch (err) {
      setError(err.response?.data?.error_description || 
               err.response?.data?.error || 
               'Failed to authenticate with DigiLocker');
    } finally {
      setLoading(false);
    }
  };

  const cleanUrl = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const initiateLogin = () => {
    setLoading(true);
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('digilocker_state', state);
    
    const authUrl = new URL(config.authEndpoint);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', config.clientId);
    authUrl.searchParams.append('redirect_uri', config.redirectUri);
    authUrl.searchParams.append('state', state);
    
    window.location.href = authUrl.toString();
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Connecting to DigiLocker...</h2>
        <p>Please wait while we authenticate your session.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={initiateLogin}>Try Again</button>
      </div>
    );
  }

  if (authData) {
    return (
      <div className="success">
        <h2>Authentication Successful</h2>
        <div className="token-info">
          <p><strong>Access Token:</strong> {authData.access_token}</p>
          <p><strong>Token Type:</strong> {authData.token_type}</p>
          <p><strong>Expires In:</strong> {authData.expires_in} seconds</p>
          {authData.refresh_token && (
            <p><strong>Refresh Token:</strong> {authData.refresh_token}</p>
          )}
        </div>
        <div className="user-info">
          <h3>User Details</h3>
          <p><strong>Name:</strong> {authData.name}</p>
          <p><strong>DigiLocker ID:</strong> {authData.digilockerid}</p>
          <p><strong>Date of Birth:</strong> {authData.dob}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <h2>DigiLocker Integration</h2>
      <button onClick={initiateLogin}>Login with DigiLocker</button>
    </div>
  );
}

export default App;