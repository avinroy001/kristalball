import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PurchasesPage from "./pages/PurchasesPage";
import TransfersPage from "./pages/TransfersPage";
import AssignmentsExpendituresPage from "./pages/AssignmentsExpendituresPage";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const userToken = localStorage.getItem("token");
  if (!userToken) return <Navigate to="/" />;

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "admin"; // fallback

  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "commander", "logistics"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute allowedRoles={["admin", "logistics"]}>
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfers"
          element={
            <ProtectedRoute allowedRoles={["admin", "logistics"]}>
              <TransfersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments-expenditures"
          element={
            <ProtectedRoute allowedRoles={["admin", "commander"]}>
              <AssignmentsExpendituresPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;