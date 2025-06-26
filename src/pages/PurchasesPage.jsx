import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchasesPage = () => {
  const [form, setForm] = useState({ base: "", equipmentType: "", quantity: "", date: "" });
  const [purchases, setPurchases] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("https://kristalball.onrender.com/api/purchases ", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases(res.data);
    } catch (err) {
      alert("Failed to load purchases");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://kristalball.onrender.com/api/purchases ", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases([...purchases, res.data]);
      setForm({ base: "", equipmentType: "", quantity: "", date: "" });
    } catch (err) {
      alert("Purchase recording failed");
    }
  };

  return (
    <div>
      <h2>Record Purchase</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Base" value={form.base} onChange={(e) => setForm({ ...form, base: e.target.value })} required />
        <input placeholder="Equipment Type" value={form.equipmentType} onChange={(e) => setForm({ ...form, equipmentType: e.target.value })} required />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <button type="submit">Add Purchase</button>
      </form>

      <h3>Purchase History</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Base</th>
            <th>Equipment</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, i) => (
            <tr key={i}>
              <td>{new Date(p.date).toLocaleDateString()}</td>
              <td>{p.base}</td>
              <td>{p.equipmentType}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesPage;