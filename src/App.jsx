// DigiLockerAuth.jsx
import React, { useEffect } from "react";
import axios from "axios";



function DigiLockerAuth() {
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlParams.entries());
  
      console.log("URL Params received from DigiLocker:", params);
  
      const code = params.code;
  
      if (code) {
        getToken(code);
      }
    } catch (err) {
      console.error("Error while parsing URL parameters:", err);
    }
  }, []);
  
  const getToken = async (code) => {
    try {
      const response = await axios({
        method:"post",
        url:'https://manager-server.onrender.com/teacher/digilocker',
        data:{
          code:code
        }
      });
     
      console.log(response)
      console.log("Access token response:", response.data);
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Verify your Account with DigiLocker</h2>
     
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
  button: {
    padding: "12px 20px",
    fontSize: "1rem",
    backgroundColor: "#1f4e78",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default DigiLockerAuth;
