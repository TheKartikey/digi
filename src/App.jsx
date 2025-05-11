import React, { useEffect, useState } from "react";
import axios from "axios";

function DigiLockerAuth() {
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
console.log(code)
      if (code) {
        setLoading(true);

        try {
          const response = await axios.post(
            "https://manager-server.onrender.com/teacher/digilocker",
            { code }
          );
console.log(response)
          console.log("Access token response:", response.data);
          setTokenData(response.data);
        } catch (err) {
          console.log("Error getting token:", err.response?.data || err.message);
          setError("Failed to fetch DigiLocker token. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchToken();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Verify your Account with DigiLocker</h2>
      {loading && <p>Loading token...</p>}
      {tokenData && <pre style={styles.tokenBox}>{JSON.stringify(tokenData, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "500px",
    margin: "100px auto",
    padding: "2rem",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  title: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "#1f4e78",
  },
  tokenBox: {
    textAlign: "left",
    marginTop: "1rem",
    backgroundColor: "#f8f8f8",
    padding: "1rem",
    borderRadius: "8px",
    maxHeight: "300px",
    overflow: "auto",
    fontSize: "0.9rem",
    whiteSpace: "pre-wrap",
  },
};

export default DigiLockerAuth;
