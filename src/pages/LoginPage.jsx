import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data } = await axios.post("http://localhost:3001/api/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;