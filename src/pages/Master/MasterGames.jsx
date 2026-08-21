import React, { useState, useEffect, useCallback } from "react";
import MasterLayout from "./MasterLayout";
import { listGames } from "../../api/games";

const PAGE_SIZE = 20;

const MasterGames = () => {
  const [games, setGames]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const p = { page, limit: PAGE_SIZE };
    if (search) p.search = search;
    listGames(p).then(r => {
      if (r?.success) { setGames(r.data.games); setTotal(r.data.total); }
    }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <MasterLayout pageTitle="Games (View Only)">
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Active</p><h4 style={{ color: "#4ade80" }}>{games.filter(g => g.status === "active").length}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Game Catalog</h3>
          <div className="p-search-bar">
            <input placeholder="Search game..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Provider</th><th>Status</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={5} className="p-nodata">Loading…</td></tr>
                  : games.length === 0
                    ? <tr><td colSpan={5} className="p-nodata">No games found.</td></tr>
                    : games.map((g, i) => (
                      <tr key={g._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#e8f0f8", fontWeight: 600 }}>{g.name}</td>
                        <td><span className="p-badge user">{g.category}</span></td>
                        <td style={{ fontSize: 11 }}>{g.provider || "—"}</td>
                        <td><span className={`p-badge ${g.status}`}>{g.status}</span></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="p-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterGames;
