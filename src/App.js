import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit/Deposit";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Home */}
        <Route path="/home" element={<Home />} />

        {/* Extra Pages */}
        <Route path="/deposit" element={<Deposit />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/responsible-gaming" element={<ResponsibleGaming />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;