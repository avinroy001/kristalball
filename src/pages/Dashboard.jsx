import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/assets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssets(res.data));

    axios
      .get("http://localhost:3001/api/movements", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMovements(res.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Assets</h2>
      {assets.map((asset) => (
        <div key={asset._id}>
          <strong>{asset.type}:</strong> {asset.quantity} at {asset.base}
        </div>
      ))}

      <h2>Movements</h2>
      {movements.map((m, i) => (
        <div key={i}>
          {m.type} of {m.quantity} for {m.assetId.type} from {m.from} to {m.to} on {new Date(m.date).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;