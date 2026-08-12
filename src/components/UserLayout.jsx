import React from "react";
import TopNav from "./dashboard/TopNav";

const UserLayout = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "#111111", display: "flex", flexDirection: "column" }}>
    <TopNav />
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </div>
);

export default UserLayout;
