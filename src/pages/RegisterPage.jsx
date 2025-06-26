import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value.trim() }); // Trim input values
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { username, password, role } = form;

    // Basic frontend validation
    if (!username || !password || !role) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://kristalball.onrender.com/api/auth/register ", form); // Fixed extra space
      setMessage(res.data.message || "Registration successful!");
      setForm({ username: "", password: "", role: "admin" });
      
      setTimeout(() => {
        navigate("/"); // Redirect to login after success
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Role:</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="admin">Admin</option>
            <option value="commander">Commander</option>
            <option value="logistics">Logistics</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: loading ? "#999" : "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            borderRadius: "4px",
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p style={{
          marginTop: 16,
          color: message.includes("failed") || message.includes("already exists")
            ? "red"
            : "green",
          fontWeight: "bold"
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;