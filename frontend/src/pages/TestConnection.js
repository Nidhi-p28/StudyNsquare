import React, { useEffect, useState } from "react";
import axios from "axios";

const TestConnection = () => {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/test") // 👈 Full backend URL
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setMessage("Failed to connect to backend ❌");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Frontend ↔ Backend Test</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestConnection;
