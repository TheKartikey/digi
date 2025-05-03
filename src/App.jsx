import { useEffect, useState } from 'react'

import './App.css'

function App() {
  useEffect(() => {
    const queryParams = queryString.parse(window.location.search);
    const hashParams = queryString.parse(window.location.hash);
    const params = { ...queryParams, ...hashParams };

    const {
      code,
      state,
      access_token,
      expires_in,
      token_type,
      scope,
      error,
    } = params;

    if (error) {
      console.error("❌ Error:", error);
      alert("OAuth failed: " + error);
      return;
    }

    let deepLink = "nextride://callback?";
    if (code) {
      deepLink += `code=${code}&state=${state}`;
    } else if (access_token) {
      deepLink += `access_token=${access_token}&expires_in=${expires_in}&token_type=${token_type}&scope=${scope}`;
    }

    console.log("🔁 OAuth params:", params);
    console.log("🚀 Redirecting to deep link:", deepLink);

    window.location.href = deepLink; // Trigger deep link to mobile app
  }, []);
  return (
    <>
       <div>
      <h2 style={{ color: "#1f4e78" }}>Processing DigiLocker Login.....</h2>
      <p style={{ color: "#1f4e7880" }}>
        Check console for OAuth code and redirecting to app.
      </p>
    </div>
    </>
  )
}

export default App
