import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignmentsExpendituresPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  const [assignForm, setAssignForm] = useState({ personnelId: "", assetId: "", date: "" });
  const [expendForm, setExpendForm] = useState({ assetId: "", reason: "", date: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssignments();
    fetchExpenditures();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("https://kristalball.onrender.com/api/assignments ", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      alert("Failed to load assignments");
    }
  };

  const fetchExpenditures = async () => {
    try {
      const res = await axios.get("https://kristalball.onrender.com/api/expenditures ", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenditures(res.data);
    } catch (err) {
      alert("Failed to load expenditures");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://kristalball.onrender.com/api/assignments ", assignForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments([...assignments, res.data]);
      setAssignForm({ personnelId: "", assetId: "", date: "" });
    } catch (err) {
      alert("Assignment failed");
    }
  };

  const handleExpend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://kristalball.onrender.com/api/expenditures ", expendForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenditures([...expenditures, res.data]);
      setExpendForm({ assetId: "", reason: "", date: "" });
    } catch (err) {
      alert("Expenditure logging failed");
    }
  };

  return (
    <div>
      <h2>Assign & Expended Assets</h2>

      <h3>Assign Asset</h3>
      <form onSubmit={handleAssign}>
        <input placeholder="Personnel ID" value={assignForm.personnelId} onChange={(e) => setAssignForm({ ...assignForm, personnelId: e.target.value })} required />
        <input placeholder="Asset ID" value={assignForm.assetId} onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })} required />
        <input type="date" value={assignForm.date} onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })} required />
        <button type="submit">Assign</button>
      </form>

      <h3>Log Expenditure</h3>
      <form onSubmit={handleExpend}>
        <input placeholder="Asset ID" value={expendForm.assetId} onChange={(e) => setExpendForm({ ...expendForm, assetId: e.target.value })} required />
        <input placeholder="Reason" value={expendForm.reason} onChange={(e) => setExpendForm({ ...expendForm, reason: e.target.value })} required />
        <input type="date" value={expendForm.date} onChange={(e) => setExpendForm({ ...expendForm, date: e.target.value })} required />
        <button type="submit">Expended</button>
      </form>

      <h3>Current Assignments</h3>
      <ul>
        {assignments.map((a, i) => (
          <li key={i}>{a.assetId} → Personnel {a.personnelId} | {new Date(a.date).toLocaleDateString()}</li>
        ))}
      </ul>

      <h3>Expenditures</h3>
      <ul>
        {expenditures.map((e, i) => (
          <li key={i}>{e.assetId} | Reason: {e.reason} | {new Date(e.date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentsExpendituresPage;