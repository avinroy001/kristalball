import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const { data } = await axios.post("https://kristalball.onrender.com/api/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", data.token);

    // Decode the JWT to get the role, or have your server return it directly
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    localStorage.setItem("user", JSON.stringify({ role: payload.role }));

    navigate("/dashboard");
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    alert("Login failed");
  }
};


  return (
    <div>
      <h1>Login</h1>
      <input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate("/register")}>Register Now</button>
    </div>
  );
}

export default LoginPage;
