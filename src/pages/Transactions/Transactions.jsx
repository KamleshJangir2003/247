import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import { listTransactions } from "../../api/wallet";
import "./Transactions.css";

const PAGE_SIZE = 20;

const Transactions = () => {
  const [rows, setRows]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [filter, setFilter] = useState("All");
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: PAGE_SIZE };
    if (filter === "Deposit")  params.type = "DEPOSIT";
    if (filter === "Withdraw") params.type = "WITHDRAWAL";
    listTransactions(params).then((res) => {
      if (res?.success) { setRows(res.data.transactions); setTotal(res.data.total); }
    }).finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fmtType = (type) => {
    if (type === "DEPOSIT")    return "Deposit";
    if (type === "WITHDRAWAL") return "Withdraw";
    return type?.replace(/_/g, " ") ?? "—";
  };

  const fmtStatus = (s) => s ? s.charAt(0) + s.slice(1).toLowerCase() : "—";

  return (
    <div className="txn-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="txn-content">
          <div className="txn-header"><span className="txn-dot"></span> Transaction History</div>

          <div className="txn-filters">
            {["All", "Deposit", "Withdraw"].map(f => (
              <button key={f} className={filter === f ? "txn-filter-btn active" : "txn-filter-btn"}
                onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>

          <div className="txn-table-wrap">
            <table>
              <thead>
                <tr><th>SN.</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Reference</th></tr>
              </thead>
              <tbody>
                {loading
                  ? <tr><td colSpan={6} className="txn-nodata">Loading…</td></tr>
                  : rows.length === 0
                    ? <tr><td colSpan={6} className="txn-nodata">No transactions found.</td></tr>
                    : rows.map((row, i) => (
                      <tr key={row._id}>
                        <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td><span className={`txn-type ${fmtType(row.type).toLowerCase()}`}>{fmtType(row.type)}</span></td>
                        <td>₹{row.amount?.toLocaleString("en-IN")}</td>
                        <td><span className={`txn-status ${row.status?.toLowerCase()}`}>{fmtStatus(row.status)}</span></td>
                        <td>{new Date(row.createdAt).toLocaleString("en-IN")}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 11 }}>{row.reference}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? "txn-filter-btn active" : "txn-filter-btn"} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transactions;
