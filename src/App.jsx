import { useEffect, useState } from 'react'

import './App.css'

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    console.log("🔁 DigiLocker  OAuth  Redirect  Response:");
    console.log("Code:", code);
    console.log("State:", state);
    console.log("Error:", error);

    if (code) {
      const deepLink = `nextride://callback?code=${code}&state=${state}`;
      console.log("Redirecting to deep link:", deepLink);

      window.location.href = deepLink;
    }
  }, []);

  return (
    <>
       <div>
      <h2 style={{ color: "#1f4e78" }}>Processing DigiLocker Login...</h2>
      <p style={{ color: "#1f4e7880" }}>
        Check console for OAuth code and redirecting to app.
      </p>
    </div>
    </>
  )
}

export default App
