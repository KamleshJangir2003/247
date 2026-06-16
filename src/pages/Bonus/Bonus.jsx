import React from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import "./Bonus.css";

const bonuses = [
  { icon:"🎁", title:"Welcome Bonus",      desc:"Get 100% bonus on your first deposit up to ₹10,000.", status:"Active",   expiry:"31/12/2026" },
  { icon:"🔄", title:"Reload Bonus",       desc:"Get 20% bonus on every deposit above ₹1,000.",        status:"Active",   expiry:"31/12/2026" },
  { icon:"👥", title:"Referral Bonus",     desc:"Earn ₹500 for every friend you refer.",               status:"Active",   expiry:"No Expiry"  },
  { icon:"🏆", title:"Loyalty Bonus",      desc:"Weekly cashback up to 5% on net losses.",             status:"Active",   expiry:"Weekly"     },
  { icon:"🎰", title:"Casino Cashback",    desc:"10% cashback on live casino losses every Monday.",    status:"Inactive", expiry:"Expired"    },
];

const Bonus = () => (
  <div className="bonus-page">
    <Header />
    <div className="main-layout">
      <AccountSidebar />
      <div className="bonus-content">
        <div className="bonus-header"><span className="b-dot"></span> Bonus & Offers</div>
        <div className="bonus-grid">
          {bonuses.map((b, i) => (
            <div key={i} className={`bonus-card ${b.status.toLowerCase()}`}>
              <div className="bonus-icon">{b.icon}</div>
              <div className="bonus-info">
                <div className="bonus-title">{b.title}</div>
                <div className="bonus-desc">{b.desc}</div>
                <div className="bonus-expiry">Expiry: {b.expiry}</div>
              </div>
              <span className={`bonus-badge ${b.status.toLowerCase()}`}>{b.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Bonus;
