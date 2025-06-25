import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/assets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssets(res.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {assets.map((asset) => (
        <div key={asset._id}>
          <strong>{asset.type}:</strong> {asset.quantity} at {asset.base}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;