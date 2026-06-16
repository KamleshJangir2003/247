import React, { useState } from "react";
import TopNav from "../../components/dashboard/TopNav";
import SBHeader from "../../components/dashboard/SBHeader";
import SBSidebar from "../../components/dashboard/SBSidebar";
import SBMainBanner from "../../components/dashboard/SBMainBanner";
import SBSportsTabs from "../../components/dashboard/SBSportsTabs";
import SBOddsTable from "../../components/dashboard/SBOddsTable";
import SBRightSidebar from "../../components/dashboard/SBRightSidebar";
import "./dashboard.css";

const Dashboard = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilter = (val) => {
    setActiveFilter(val);
    setMobileMenu(false);
  };

  return (
    <div className="sb-wrap">
      <TopNav />
      <SBHeader onMenu={() => setMobileMenu(!mobileMenu)} onFilter={handleFilter} activeFilter={activeFilter} />
      <div className="sb-body">
        <div className={`sb-left ${mobileMenu ? "sb-left-open" : ""}`}>
          <SBSidebar onFilter={handleFilter} activeFilter={activeFilter} />
        </div>
        {mobileMenu && <div className="sb-mob-overlay" onClick={() => setMobileMenu(false)} />}
        <div className="sb-center">
          <SBMainBanner />
          <SBSportsTabs onFilter={handleFilter} activeFilter={activeFilter} />
          <SBOddsTable activeFilter={activeFilter} />
        </div>
        <div className="sb-right">
          <SBRightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
