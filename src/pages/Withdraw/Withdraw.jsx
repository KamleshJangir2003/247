import React, { useState, useEffect, useCallback } from "react";
import "./Withdraw.css";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import { createWithdrawal, listWithdrawals, getBalance } from "../../api/wallet";

const METHODS = ["UPI", "Bank Transfer", "IMPS", "NEFT"];

const Withdraw = () => {
  const [showRules, setShowRules] = useState(false);
  const [method, setMethod]       = useState("UPI");
  const [amount, setAmount]       = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc]           = useState("");
  const [upiId, setUpiId]         = useState("");
  const [name, setName]           = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [history, setHistory]     = useState([]);
  const [balance, setBalance]     = useState(null);
  const [msg, setMsg]             = useState(null);
  const [loading, setLoading]     = useState(false);

  const loadData = useCallback(() => {
    getBalance().then((res) => {
      if (res?.success) setBalance(res.data.wallet.balance ?? 0);
    }).catch(() => {});
    listWithdrawals({ limit: 50 }).then((res) => {
      if (res?.success) setHistory(res.data.withdrawals);
    }).catch(() => {});
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAmountBtn = (val) => setAmount(String(val));

  const handleSubmit = async () => {
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt < 500)
      return setMsg({ type: "error", text: "Minimum withdrawal amount is ₹500." });
    if (balance !== null && amt > balance)
      return setMsg({ type: "error", text: "Insufficient balance." });
    if (!name.trim())
      return setMsg({ type: "error", text: "Please enter account holder name." });
    if (method === "UPI" && !upiId.trim())
      return setMsg({ type: "error", text: "Please enter UPI ID." });
    if (method !== "UPI" && (!accountNo.trim() || !ifsc.trim()))
      return setMsg({ type: "error", text: "Please enter account number and IFSC." });
    if (!agreed)
      return setMsg({ type: "error", text: "Please agree to terms." });

    const bankDetails = method === "UPI"
      ? { method, upiId, accountHolderName: name }
      : { method, accountNo, ifsc, accountHolderName: name };

    setLoading(true);
    const res = await createWithdrawal({ amount: amt, bankDetails });
    setLoading(false);

    if (res?.success) {
      setMsg({ type: "success", text: "Withdrawal request submitted! Processing in 24-48 hours." });
      setAmount(""); setAccountNo(""); setIfsc(""); setUpiId(""); setName(""); setAgreed(false);
      loadData();
    } else {
      setMsg({ type: "error", text: res?.message || "Withdrawal failed." });
    }
    setTimeout(() => setMsg(null), 5000);
  };

  return (
    <div className="withdraw-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="withdraw-content">

          <div className="withdraw-header">
            <div className="withdraw-title"><span className="wdot"></span> Withdraw</div>
            <div className="withdraw-balance">
              Available Balance: <strong>{balance !== null ? `₹${balance.toLocaleString("en-IN")}` : "—"}</strong>
            </div>
          </div>

          {msg && <div className={`wd-msg ${msg.type}`}>{msg.text}</div>}

          <div className="rules-box">
            <h4 onClick={() => setShowRules(!showRules)} style={{ cursor: "pointer" }}>
              Rules and Regulations for withdrawal {showRules ? "▲" : "▼"}
            </h4>
            {showRules && (
              <>
                <p>1. Minimum withdrawal amount is ₹500.</p>
                <p>2. Withdrawal requests are processed within 24-48 hours.</p>
                <p>3. Ensure your bank details are correct before submitting.</p>
                <p>4. UPI withdrawals are processed faster (within 2-4 hours).</p>
                <p>5. NEFT/IMPS may take up to 2 business days.</p>
                <p>6. Withdrawals are only allowed to verified accounts.</p>
              </>
            )}
          </div>

          <div className="wd-body">
            <div className="wd-methods">
              {METHODS.map((m) => (
                <button key={m} className={method === m ? "wd-method-btn active" : "wd-method-btn"} onClick={() => setMethod(m)}>{m}</button>
              ))}
            </div>

            <div className="wd-form-wrap">
              <div className="wd-form-group">
                <label>Account Holder Name*</label>
                <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              {method === "UPI" ? (
                <div className="wd-form-group">
                  <label>UPI ID*</label>
                  <input type="text" placeholder="e.g. yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
              ) : (
                <>
                  <div className="wd-form-group">
                    <label>Account Number*</label>
                    <input type="text" placeholder="Enter bank account number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
                  </div>
                  <div className="wd-form-group">
                    <label>IFSC Code*</label>
                    <input type="text" placeholder="e.g. SBIN0001234" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} />
                  </div>
                </>
              )}

              <div className="wd-form-group">
                <label>Withdrawal Amount* (Min ₹500)</label>
                <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>

              <div className="wd-amount-btns">
                {[500, 1000, 2000, 5000, 10000, 50000].map((v) => (
                  <button key={v} onClick={() => handleAmountBtn(v)}>{v >= 1000 ? `${v / 1000}K` : v}</button>
                ))}
              </div>

              <div className="wd-checkbox">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I confirm the details are correct and agree to the withdrawal policy.</span>
              </div>

              <button className="wd-submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Please wait…" : "SUBMIT WITHDRAWAL"}
              </button>
            </div>
          </div>

          <div className="wd-table-section">
            <div className="wd-table-title">Withdrawal History</div>
            <table>
              <thead>
                <tr><th>SN.</th><th>Amount</th><th>Status</th><th>Date</th><th>Method</th><th>Account</th></tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={row._id}>
                    <td>{i + 1}</td>
                    <td>₹{row.amount?.toLocaleString("en-IN")}</td>
                    <td><span className={`wd-status ${row.status?.toLowerCase()}`}>{row.status}</span></td>
                    <td>{new Date(row.createdAt).toLocaleString("en-IN")}</td>
                    <td>{row.bankDetails?.method || "—"}</td>
                    <td>{row.bankDetails?.upiId || row.bankDetails?.accountNo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="no-data">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="" />
                <p>No data</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Withdraw;
