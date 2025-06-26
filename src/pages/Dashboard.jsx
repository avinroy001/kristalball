import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.username || "User"}!</h1>
      <h2>Dashboard</h2>

      <p>Select a module below to continue:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: 300 }}>
        <button onClick={() => handleNavigation("/dashboard")}>Dashboard</button>
        <button onClick={() => handleNavigation("/purchases")}>Purchases</button>
        <button onClick={() => handleNavigation("/transfers")}>Transfers</button>
        <button onClick={() => handleNavigation("/assignments-expenditures")}>Assignments & Expenditures</button>
      </div>
    </div>
  );
};

export default Dashboard;