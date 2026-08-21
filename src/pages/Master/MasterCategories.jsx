import React, { useState, useEffect } from "react";
import MasterLayout from "./MasterLayout";
import { listCategories } from "../../api/games";

const MasterCategories = () => {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories().then(r => {
      if (r?.success) setCats(r.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <MasterLayout pageTitle="Categories (View Only)">
      <div className="p-card">
        <div className="p-card-header"><h3>Game Categories</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Icon</th><th>Name</th><th>Order</th><th>Status</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={5} className="p-nodata">Loading…</td></tr>
                  : cats.length === 0
                    ? <tr><td colSpan={5} className="p-nodata">No categories found.</td></tr>
                    : cats.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td style={{ fontSize: 20 }}>{c.icon || "—"}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{c.name}</td>
                        <td>{c.sortOrder}</td>
                        <td><span className={`p-badge ${c.status}`}>{c.status}</span></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterCategories;
