import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import { listBonuses, applyBonus } from "../../api/wallet";
import "./Bonus.css";

const Bonus = () => {
  const [bonuses, setBonuses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [code, setCode]         = useState("");
  const [applying, setApplying] = useState(false);
  const [msg, setMsg]           = useState(null);

  useEffect(() => {
    listBonuses({ status: "active", limit: 50 }).then((res) => {
      if (res?.success) setBonuses(res.data.bonuses);
    }).finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    if (!code.trim()) return setMsg({ type: "error", text: "Enter a bonus code." });
    setApplying(true);
    const res = await applyBonus(code.trim().toUpperCase(), 0);
    setApplying(false);
    if (res?.success) {
      setMsg({ type: "success", text: `Bonus applied! ₹${res.data.bonusAmount} credited to your wallet.` });
      setCode("");
    } else {
      setMsg({ type: "error", text: res?.message || "Failed to apply bonus." });
    }
    setTimeout(() => setMsg(null), 5000);
  };

  const fmtExpiry = (b) => {
    if (b.endDate) return new Date(b.endDate).toLocaleDateString("en-IN");
    return "No Expiry";
  };

  const fmtDesc = (b) => {
    const parts = [];
    if (b.percentage > 0) parts.push(`${b.percentage}% bonus`);
    if (b.fixedAmount > 0) parts.push(`₹${b.fixedAmount} fixed`);
    if (b.minDeposit > 0) parts.push(`min deposit ₹${b.minDeposit}`);
    if (b.maxBonus > 0) parts.push(`up to ₹${b.maxBonus}`);
    return b.description || (parts.length ? parts.join(", ") : "Special offer");
  };

  return (
    <div className="bonus-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="bonus-content">
          <div className="bonus-header"><span className="b-dot"></span> Bonus &amp; Offers</div>

          {/* Redeem code input */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Enter bonus code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #1a2a3a", background: "#0a0f1a", color: "#c0d0e0", fontSize: 13, width: 200 }}
            />
            <button
              onClick={handleApply}
              disabled={applying}
              style={{ padding: "8px 18px", borderRadius: 6, background: "#1a6aff", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}
            >
              {applying ? "Applying…" : "Apply Code"}
            </button>
          </div>

          {msg && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 6, fontSize: 13,
              background: msg.type === "success" ? "#0a2a1a" : "#2a0a0a",
              color: msg.type === "success" ? "#4ade80" : "#f87171",
              border: `1px solid ${msg.type === "success" ? "#1a4a2a" : "#4a1a1a"}` }}>
              {msg.text}
            </div>
          )}

          {loading ? (
            <div style={{ color: "#7a9ab8", padding: 20 }}>Loading…</div>
          ) : (
            <div className="bonus-grid">
              {bonuses.length === 0 ? (
                <div style={{ color: "#7a9ab8", padding: 20 }}>No active bonuses available.</div>
              ) : bonuses.map((b) => (
                <div key={b._id} className={`bonus-card ${b.status}`}>
                  <div className="bonus-icon">🎁</div>
                  <div className="bonus-info">
                    <div className="bonus-title">{b.name}</div>
                    <div className="bonus-desc">{fmtDesc(b)}</div>
                    <div className="bonus-expiry">Code: <strong>{b.code}</strong> · Expiry: {fmtExpiry(b)}</div>
                  </div>
                  <span className={`bonus-badge ${b.status}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bonus;
