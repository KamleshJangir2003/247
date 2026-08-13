import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleGuard from "./components/guards/RoleGuard";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Static pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";
import ResponsibleGaming from "./pages/ResponsibleGaming";

// User Panel
import UserLayout from "./components/UserLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import Transactions from "./pages/Transactions/Transactions";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Bonus from "./pages/Bonus/Bonus";
import Support from "./pages/Support/Support";
import LiveCasinoPage from "./pages/LiveCasino/LiveCasinoPage";
import LotteryPage from "./pages/Lottery/LotteryPage";
import Sportsbook1Page from "./pages/Sportsbook1/Sportsbook1Page";
import ExchangePage from "./pages/Exchange/ExchangePage";
import SlotPage from "./pages/Slot/SlotPage";
import FantasyGamesPage from "./pages/FantasyGames/FantasyGamesPage";
import CrashPage from "./pages/Crash/CrashPage";

// Master Panel
import MasterDashboard from "./pages/Master/MasterDashboard";
import MasterAdmins from "./pages/Master/MasterAdmins";
import MasterAgents from "./pages/Master/MasterAgents";
import MasterUsers from "./pages/Master/MasterUsers";
import MasterGames from "./pages/Master/MasterGames";
import MasterCategories from "./pages/Master/MasterCategories";
import MasterProviders from "./pages/Master/MasterProviders";
import MasterBanners from "./pages/Master/MasterBanners";
import MasterAnnouncements from "./pages/Master/MasterAnnouncements";
import MasterPermissions from "./pages/Master/MasterPermissions";
import MasterActivity from "./pages/Master/MasterActivity";
import MasterSettings from "./pages/Master/MasterSettings";

// Admin Panel
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAgents from "./pages/Admin/AdminAgents";
import AdminDeposits from "./pages/Admin/AdminDeposits";
import AdminWithdrawals from "./pages/Admin/AdminWithdrawals";
import AdminTransactions from "./pages/Admin/AdminTransactions";
import AdminGames from "./pages/Admin/AdminGames";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminProviders from "./pages/Admin/AdminProviders";
import AdminBanners from "./pages/Admin/AdminBanners";
import AdminActivity from "./pages/Admin/AdminActivity";
import AdminPermissions from "./pages/Admin/AdminPermissions";

// Agent Panel
import AgentDashboard from "./pages/Agent/AgentDashboard";
import AgentUsers from "./pages/Agent/AgentUsers";
import AgentUserDetails from "./pages/Agent/AgentUserDetails";
import AgentUserActivity from "./pages/Agent/AgentUserActivity";
import AgentReports from "./pages/Agent/AgentReports";
import AgentProfile from "./pages/Agent/AgentProfile";

const M = ["master"];
const MA = ["master", "admin"];
const AG = ["agent"];
const U = ["user"];

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/responsible-gaming" element={<ResponsibleGaming />} />

        {/* User Panel */}
        <Route path="/home"         element={<RoleGuard roles={U}><Home /></RoleGuard>} />
        <Route path="/dashboard"    element={<RoleGuard roles={U}><Dashboard /></RoleGuard>} />
        <Route path="/deposit"      element={<RoleGuard roles={U}><Deposit /></RoleGuard>} />
        <Route path="/withdraw"     element={<RoleGuard roles={U}><Withdraw /></RoleGuard>} />
        <Route path="/transactions" element={<RoleGuard roles={U}><Transactions /></RoleGuard>} />
        <Route path="/profile"      element={<RoleGuard roles={U}><Profile /></RoleGuard>} />
        <Route path="/change-password" element={<RoleGuard roles={U}><ChangePassword /></RoleGuard>} />
        <Route path="/bonus"        element={<RoleGuard roles={U}><Bonus /></RoleGuard>} />
        <Route path="/support"      element={<RoleGuard roles={U}><Support /></RoleGuard>} />
        <Route path="/live-casino"  element={<RoleGuard roles={U}><UserLayout><LiveCasinoPage /></UserLayout></RoleGuard>} />
        <Route path="/lottery"      element={<RoleGuard roles={U}><UserLayout><LotteryPage /></UserLayout></RoleGuard>} />
        <Route path="/sportsbook1"  element={<RoleGuard roles={U}><UserLayout><Sportsbook1Page /></UserLayout></RoleGuard>} />
        <Route path="/exchange"     element={<RoleGuard roles={U}><UserLayout><ExchangePage /></UserLayout></RoleGuard>} />
        <Route path="/slot"         element={<RoleGuard roles={U}><UserLayout><SlotPage /></UserLayout></RoleGuard>} />
        <Route path="/fantasy-games"element={<RoleGuard roles={U}><UserLayout><FantasyGamesPage /></UserLayout></RoleGuard>} />
        <Route path="/crash"        element={<RoleGuard roles={U}><UserLayout><CrashPage /></UserLayout></RoleGuard>} />

        {/* Master Panel */}
        <Route path="/master/dashboard"    element={<RoleGuard roles={M}><MasterDashboard /></RoleGuard>} />
        <Route path="/master/admins"       element={<RoleGuard roles={M}><MasterAdmins /></RoleGuard>} />
        <Route path="/master/agents"       element={<RoleGuard roles={M}><MasterAgents /></RoleGuard>} />
        <Route path="/master/users"        element={<RoleGuard roles={M}><MasterUsers /></RoleGuard>} />
        <Route path="/master/games"        element={<RoleGuard roles={M}><MasterGames /></RoleGuard>} />
        <Route path="/master/categories"   element={<RoleGuard roles={M}><MasterCategories /></RoleGuard>} />
        <Route path="/master/providers"    element={<RoleGuard roles={M}><MasterProviders /></RoleGuard>} />
        <Route path="/master/banners"      element={<RoleGuard roles={M}><MasterBanners /></RoleGuard>} />
        <Route path="/master/announcements"element={<RoleGuard roles={M}><MasterAnnouncements /></RoleGuard>} />
        <Route path="/master/permissions"  element={<RoleGuard roles={M}><MasterPermissions /></RoleGuard>} />
        <Route path="/master/activity"     element={<RoleGuard roles={M}><MasterActivity /></RoleGuard>} />
        <Route path="/master/settings"     element={<RoleGuard roles={M}><MasterSettings /></RoleGuard>} />
        <Route path="/master"              element={<Navigate to="/master/dashboard" replace />} />

        {/* Admin Panel */}
        <Route path="/admin/dashboard"    element={<RoleGuard roles={MA}><AdminDashboard /></RoleGuard>} />
        <Route path="/admin/users"        element={<RoleGuard roles={MA}><AdminUsers /></RoleGuard>} />
        <Route path="/admin/agents"       element={<RoleGuard roles={MA}><AdminAgents /></RoleGuard>} />
        <Route path="/admin/deposits"     element={<RoleGuard roles={MA}><AdminDeposits /></RoleGuard>} />
        <Route path="/admin/withdrawals"  element={<RoleGuard roles={MA}><AdminWithdrawals /></RoleGuard>} />
        <Route path="/admin/transactions" element={<RoleGuard roles={MA}><AdminTransactions /></RoleGuard>} />
        <Route path="/admin/games"        element={<RoleGuard roles={MA}><AdminGames /></RoleGuard>} />
        <Route path="/admin/categories"   element={<RoleGuard roles={MA}><AdminCategories /></RoleGuard>} />
        <Route path="/admin/providers"    element={<RoleGuard roles={MA}><AdminProviders /></RoleGuard>} />
        <Route path="/admin/banners"      element={<RoleGuard roles={MA}><AdminBanners /></RoleGuard>} />
        <Route path="/admin/activity"     element={<RoleGuard roles={MA}><AdminActivity /></RoleGuard>} />
        <Route path="/admin/permissions"  element={<RoleGuard roles={MA}><AdminPermissions /></RoleGuard>} />
        <Route path="/admin"              element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin-login"        element={<Navigate to="/login" replace />} />

        {/* Agent Panel */}
        <Route path="/agent/dashboard"     element={<RoleGuard roles={AG}><AgentDashboard /></RoleGuard>} />
        <Route path="/agent/users"         element={<RoleGuard roles={AG}><AgentUsers /></RoleGuard>} />
        <Route path="/agent/user-details"  element={<RoleGuard roles={AG}><AgentUserDetails /></RoleGuard>} />
        <Route path="/agent/user-activity" element={<RoleGuard roles={AG}><AgentUserActivity /></RoleGuard>} />
        <Route path="/agent/reports"       element={<RoleGuard roles={AG}><AgentReports /></RoleGuard>} />
        <Route path="/agent/profile"       element={<RoleGuard roles={AG}><AgentProfile /></RoleGuard>} />
        <Route path="/agent"               element={<Navigate to="/agent/dashboard" replace />} />

        {/* Fallback */}
        <Route path="/demo" element={<Navigate to="/login" replace />} />
        <Route path="*"     element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
