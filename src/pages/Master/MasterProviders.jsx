import React, { useState, useEffect } from "react";
import MasterLayout from "./MasterLayout";
import { listProviders } from "../../api/games";

const MasterProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    listProviders({ limit: 100 }).then(r => {
      if (r?.success) setProviders(r.data.providers);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <MasterLayout pageTitle="Providers (View Only)">
      <div className="p-card">
        <div className="p-card-header"><h3>Game Providers</h3></div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Provider</th><th>Category</th><th>Status</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={4} className="p-nodata">Loading…</td></tr>
                  : providers.length === 0
                    ? <tr><td colSpan={4} className="p-nodata">No providers found.</td></tr>
                    : providers.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{p.name}</td>
                        <td><span className="p-badge user">{p.category}</span></td>
                        <td><span className={`p-badge ${p.status}`}>{p.status}</span></td>
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

export default MasterProviders;
