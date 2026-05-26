import React, { useState } from "react";
import "./Deposit.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const Deposit = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="deposit-page">
      <Header />

      <div className="main-layout">
        <Sidebar />

        <div className="deposit-content">

          {/* HEADER */}
          <div className="deposit-header">
            <div className="deposit-title">
              <span className="dot"></span> Deposit
            </div>
          </div>

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

            {/* LEFT */}
            <div className="left-box">
              <div className="account-box">
                Not Added Any Account Yet.
              </div>
            </div>

            {/* RIGHT */}
            <div className="right-box">
              <div className="payment-box">
                <div className="no-account">
                  No account has been added yet.
                </div>

                <div className="tabs">
                  <button className="active-tab">Automatically</button>
                  <button>Manually</button>
                </div>

                <div className="form-group">
                  <label>Upload Your Payment Proof*</label>
                  <input type="file" />
                </div>

                <div className="form-group">
                  <label>Unique Transaction Reference*</label>
                  <input type="text" placeholder="Up to 12 Digit UTR Number" />
                </div>

                <div className="form-group">
                  <label>Amount*</label>
                  <input type="text" placeholder="Enter amount" />
                </div>

                <div className="amount-buttons">
                  <button>500</button>
                  <button>1000</button>
                  <button>5000</button>
                  <button>10000</button>
                  <button>50000</button>
                  <button>100000</button>
                </div>

                <div className="checkbox">
                  <input type="checkbox" />
                  <span>
                    I have read and agree with terms of payment and withdrawal policy.
                  </span>
                </div>

                <button className="submit-btn">SUBMIT</button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-section">
            <table>
              <thead>
                <tr>
                  <th>SN.</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Utr</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
            </table>

            <div className="no-data">
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                alt=""
              />
              <p>No data</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Deposit;
