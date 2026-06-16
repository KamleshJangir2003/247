import React, { useState } from "react";
import "./Deposit.css";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";

const Deposit = () => {
  const [showRules, setShowRules] = useState(false);
  const [activeTab, setActiveTab] = useState("auto");
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState(null);

  const handleAmountBtn = (val) => setAmount(String(val));

  const handleSubmit = () => {
    if (!utr.trim()) return setMsg({ type: "error", text: "Please enter UTR number." });
    if (!amount || isNaN(amount) || Number(amount) < 100) return setMsg({ type: "error", text: "Enter valid amount (min ₹100)." });
    if (!agreed) return setMsg({ type: "error", text: "Please agree to terms." });

    const newEntry = {
      sn: history.length + 1,
      amount: Number(amount).toLocaleString("en-IN"),
      status: "Pending",
      date: new Date().toLocaleString("en-IN"),
      utr: utr,
      method: activeTab === "auto" ? "Auto / UPI" : "Manual",
    };
    setHistory([newEntry, ...history]);
    setMsg({ type: "success", text: "Deposit request submitted successfully!" });
    setUtr(""); setAmount(""); setFile(null); setAgreed(false);
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <div className="deposit-page">
      <Header />

      <div className="main-layout">
        <AccountSidebar />

        <div className="deposit-content">

          {/* HEADER */}
          <div className="deposit-header">
            <div className="deposit-title">
              <span className="dot"></span> Deposit
            </div>
          </div>

          {/* MESSAGE */}
          {msg && (
            <div className={`dep-msg ${msg.type}`}>{msg.text}</div>
          )}

          {/* RULES */}
          <div className="rules-box">
            <h4 onClick={() => setShowRules(!showRules)} style={{ cursor: "pointer" }}>
              Rules and Regulations for deposit {showRules ? "▲" : "▼"}
            </h4>
            {showRules && (
              <>
                <p>1. Deposit money only in the below available accounts.</p>
                <p>2. Deposits made 45 minutes after the account removal will be added.</p>
                <p>3. Site is not responsible for money deposited to old accounts.</p>
                <p>4. After deposit, add your UTR and amount to receive balance.</p>
                <p>5. NEFT receiving time varies from 40 minutes to 2 hours.</p>
                <p>6. In case of account modification, payment valid for 1 hour.</p>
              </>
            )}
          </div>

          {/* MAIN SECTION */}
          <div className="deposit-body">

            {/* LEFT — Bank QR */}
            <div className="left-box">
              <div className="account-box">
                <div className="qr-placeholder">
                  <div className="qr-icon">🏦</div>
                  <p>Bank Account / UPI</p>
                  <p className="qr-upi">pay@777games</p>
                  <p className="qr-note">Scan QR or use UPI ID to pay</p>
                  <div className="qr-img">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=pay@777games" alt="QR" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="right-box">
              <div className="payment-box">

                <div className="tabs">
                  <button className={activeTab === "auto" ? "active-tab" : ""} onClick={() => setActiveTab("auto")}>Automatically</button>
                  <button className={activeTab === "manual" ? "active-tab" : ""} onClick={() => setActiveTab("manual")}>Manually</button>
                </div>

                <div className="form-group">
                  <label>Upload Your Payment Proof*</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                  {file && <span className="file-name">✅ {file.name}</span>}
                </div>

                <div className="form-group">
                  <label>Unique Transaction Reference*</label>
                  <input
                    type="text"
                    placeholder="Up to 12 Digit UTR Number"
                    value={utr}
                    maxLength={12}
                    onChange={(e) => setUtr(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Amount*</label>
                  <input
                    type="number"
                    placeholder="Enter amount (min ₹100)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="amount-buttons">
                  {[500, 1000, 5000, 10000, 50000, 100000].map((v) => (
                    <button key={v} onClick={() => handleAmountBtn(v)}>
                      {v >= 100000 ? "1L" : v >= 1000 ? `${v / 1000}K` : v}
                    </button>
                  ))}
                </div>

                <div className="checkbox">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <span>I have read and agree with terms of payment and withdrawal policy.</span>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>SUBMIT DEPOSIT</button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-section">
            <div className="table-title">Deposit History</div>
            <table>
              <thead>
                <tr>
                  <th>SN.</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>UTR</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.sn}>
                    <td>{row.sn}</td>
                    <td>₹{row.amount}</td>
                    <td><span className={`status-badge ${row.status.toLowerCase()}`}>{row.status}</span></td>
                    <td>{row.date}</td>
                    <td>{row.utr}</td>
                    <td>{row.method}</td>
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

export default Deposit;
