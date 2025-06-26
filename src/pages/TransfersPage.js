import React, { useState, useEffect } from "react";
import axios from "axios";

const TransfersPage = () => {
  const [form, setForm] = useState({ fromBase: "", toBase: "", assetId: "", date: "" });
  const [transfers, setTransfers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await axios.get("https://kristalball.onrender.com/api/transfers ", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransfers(res.data);
    } catch (err) {
      alert("Failed to load transfers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://kristalball.onrender.com/api/transfers ", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransfers([...transfers, res.data]);
      setForm({ fromBase: "", toBase: "", assetId: "", date: "" });
    } catch (err) {
      alert("Transfer recording failed");
    }
  };

  return (
    <div>
      <h2>Transfer Assets Between Bases</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="From Base" value={form.fromBase} onChange={(e) => setForm({ ...form, fromBase: e.target.value })} required />
        <input placeholder="To Base" value={form.toBase} onChange={(e) => setForm({ ...form, toBase: e.target.value })} required />
        <input placeholder="Asset ID" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <button type="submit">Initiate Transfer</button>
      </form>

      <h3>Transfer History</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Asset ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t, i) => (
            <tr key={i}>
              <td>{t.fromBase}</td>
              <td>{t.toBase}</td>
              <td>{t.assetId}</td>
              <td>{new Date(t.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransfersPage;