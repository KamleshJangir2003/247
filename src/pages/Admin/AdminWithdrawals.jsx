import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { listWithdrawals, approveWithdrawal, rejectWithdrawal } from "../../api/wallet";

const PAGE_SIZE = 20;

const AdminWithdrawals = () => {
  const [rows, setRows]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: PAGE_SIZE };
    if (filter !== "all") params.status = filter.toUpperCase();
    listWithdrawals(params).then((res) => {
      if (res?.success) { setRows(res.data.withdrawals); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const doApprove = async (id) => {
    const res = await approveWithdrawal(id);
    if (res?.success) load();
  };

  const doReject = async (id) => {
    const res = await rejectWithdrawal(id, "Rejected by admin");
    if (res?.success) load();
  };

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    return (r.userId?.username ?? "").toLowerCase().includes(q) ||
           (r.bankDetails?.accountNo ?? "").toLowerCase().includes(q) ||
           (r.bankDetails?.upiId ?? "").toLowerCase().includes(q);
  });

  const pending  = rows.filter(r => r.status === "PENDING").length;
  const approved = rows.filter(r => r.status === "APPROVED").length;
  const rejected = rows.filter(r => r.status === "REJECTED").length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout pageTitle="Withdrawal Requests" pendingWithdrawals={pending}>
      <div className="p-summary-row">
        <div className="p-sum-card"><p>Total</p><h4>{total}</h4></div>
        <div className="p-sum-card"><p>Pending</p><h4 style={{ color: "#fbbf24" }}>{pending}</h4></div>
        <div className="p-sum-card"><p>Approved</p><h4 style={{ color: "#4ade80" }}>{approved}</h4></div>
        <div className="p-sum-card"><p>Rejected</p><h4 style={{ color: "#f87171" }}>{rejected}</h4></div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>All Withdrawal Requests</h3>
          <div className="p-search-bar">
            <input placeholder="Search user / account" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ width: 200 }} />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead><tr><th>#</th><th>User</th><th>Amount</th><th>Method</th><th>Account</th><th>IFSC</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={9} className="p-nodata">Loading…</td></tr>
                  : filtered.length === 0
                    ? <tr><td colSpan={9} className="p-nodata">No records found.</td></tr>
                    : filtered.map((r, i) => (
                      <tr key={r._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{r.userId?.username ?? "—"}</td>
                        <td style={{ color: "#f87171", fontWeight: 600 }}>₹{r.amount?.toLocaleString("en-IN")}</td>
                        <td>{r.bankDetails?.method || "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.bankDetails?.upiId || r.bankDetails?.accountNo || "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.bankDetails?.ifsc || "—"}</td>
                        <td>{new Date(r.createdAt).toLocaleString("en-IN")}</td>
                        <td><span className={`p-badge ${r.status?.toLowerCase()}`}>{r.status?.toLowerCase()}</span></td>
                        <td>
                          {r.status === "PENDING" ? (
                            <div className="p-action-btns">
                              <button className="p-btn p-btn-approve" onClick={() => doApprove(r._id)}>Approve</button>
                              <button className="p-btn p-btn-reject"  onClick={() => doReject(r._id)}>Reject</button>
                            </div>
                          ) : <span style={{ color: "#3a4a5a", fontSize: 11 }}>—</span>}
                        </td>
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
    </AdminLayout>
  );
};

export default AdminWithdrawals;
