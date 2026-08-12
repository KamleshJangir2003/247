import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import Transactions from "./pages/Transactions/Transactions";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Bonus from "./pages/Bonus/Bonus";
import Support from "./pages/Support/Support";
import Dashboard from "./pages/Dashboard/Dashboard";
import LiveCasinoPage from "./pages/LiveCasino/LiveCasinoPage";
import LotteryPage from "./pages/Lottery/LotteryPage";
import Sportsbook1Page from "./pages/Sportsbook1/Sportsbook1Page";
import ExchangePage from "./pages/Exchange/ExchangePage";
import SlotPage from "./pages/Slot/SlotPage";
import FantasyGamesPage from "./pages/FantasyGames/FantasyGamesPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminDeposits from "./pages/Admin/AdminDeposits";
import AdminWithdrawals from "./pages/Admin/AdminWithdrawals";
import AdminTransactions from "./pages/Admin/AdminTransactions";

const AdminGuard = ({ children }) => {
  return localStorage.getItem("adminLoggedIn") === "true"
    ? children
    : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/demo" element={<Navigate to="/dashboard" replace />} />

        {/* Extra Pages */}
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/bonus" element={<Bonus />} />
        <Route path="/support" element={<Support />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
        <Route path="/live-casino" element={<LiveCasinoPage />} />
        <Route path="/lottery" element={<LotteryPage />} />
        <Route path="/sportsbook1" element={<Sportsbook1Page />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/slot" element={<SlotPage />} />
        <Route path="/fantasy-games" element={<FantasyGamesPage />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard"    element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/users"        element={<AdminGuard><AdminUsers /></AdminGuard>} />
        <Route path="/admin/deposits"     element={<AdminGuard><AdminDeposits /></AdminGuard>} />
        <Route path="/admin/withdrawals"  element={<AdminGuard><AdminWithdrawals /></AdminGuard>} />
        <Route path="/admin/transactions" element={<AdminGuard><AdminTransactions /></AdminGuard>} />
        <Route path="/admin" element={<Navigate to="/admin-login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;