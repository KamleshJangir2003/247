import React, { useState } from "react";
import "./Withdraw.css";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";

const METHODS = ["UPI", "Bank Transfer", "IMPS", "NEFT"];

const Withdraw = () => {
  const [showRules, setShowRules] = useState(false);
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState(null);
  const balance = 5000;

  const handleAmountBtn = (val) => setAmount(String(val));

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) < 500)
      return setMsg({ type: "error", text: "Minimum withdrawal amount is ₹500." });
    if (Number(amount) > balance)
      return setMsg({ type: "error", text: "Insufficient balance." });
    if (!name.trim())
      return setMsg({ type: "error", text: "Please enter account holder name." });
    if (method === "UPI" && !upiId.trim())
      return setMsg({ type: "error", text: "Please enter UPI ID." });
    if (method !== "UPI" && (!accountNo.trim() || !ifsc.trim()))
      return setMsg({ type: "error", text: "Please enter account number and IFSC." });
    if (!agreed)
      return setMsg({ type: "error", text: "Please agree to terms." });

    const newEntry = {
      sn: history.length + 1,
      amount: Number(amount).toLocaleString("en-IN"),
      status: "Pending",
      date: new Date().toLocaleString("en-IN"),
      method,
      account: method === "UPI" ? upiId : accountNo,
    };
    setHistory([newEntry, ...history]);
    setMsg({ type: "success", text: "Withdrawal request submitted! Processing in 24-48 hours." });
    setAmount(""); setAccountNo(""); setIfsc(""); setUpiId(""); setName(""); setAgreed(false);
    setTimeout(() => setMsg(null), 5000);
  };

  return (
    <div className="withdraw-page">
      <Header />

      <div className="main-layout">
        <AccountSidebar />

        <div className="withdraw-content">

          {/* HEADER */}
          <div className="withdraw-header">
            <div className="withdraw-title">
              <span className="wdot"></span> Withdraw
            </div>
            <div className="withdraw-balance">
              Available Balance: <strong>₹{balance.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          {/* MESSAGE */}
          {msg && <div className={`wd-msg ${msg.type}`}>{msg.text}</div>}

          {/* RULES */}
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

          {/* FORM */}
          <div className="wd-body">

            {/* METHOD TABS */}
            <div className="wd-methods">
              {METHODS.map((m) => (
                <button
                  key={m}
                  className={method === m ? "wd-method-btn active" : "wd-method-btn"}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="wd-form-wrap">

              <div className="wd-form-group">
                <label>Account Holder Name*</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {method === "UPI" ? (
                <div className="wd-form-group">
                  <label>UPI ID*</label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="wd-form-group">
                    <label>Account Number*</label>
                    <input
                      type="text"
                      placeholder="Enter bank account number"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                    />
                  </div>
                  <div className="wd-form-group">
                    <label>IFSC Code*</label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    />
                  </div>
                </>
              )}

              <div className="wd-form-group">
                <label>Withdrawal Amount* (Min ₹500)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="wd-amount-btns">
                {[500, 1000, 2000, 5000, 10000, 50000].map((v) => (
                  <button key={v} onClick={() => handleAmountBtn(v)}>
                    {v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>

              <div className="wd-checkbox">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I confirm the details are correct and agree to the withdrawal policy.</span>
              </div>

              <button className="wd-submit-btn" onClick={handleSubmit}>SUBMIT WITHDRAWAL</button>
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="wd-table-section">
            <div className="wd-table-title">Withdrawal History</div>
            <table>
              <thead>
                <tr>
                  <th>SN.</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Account</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.sn}>
                    <td>{row.sn}</td>
                    <td>₹{row.amount}</td>
                    <td><span className={`wd-status ${row.status.toLowerCase()}`}>{row.status}</span></td>
                    <td>{row.date}</td>
                    <td>{row.method}</td>
                    <td>{row.account}</td>
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
