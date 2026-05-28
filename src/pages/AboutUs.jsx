import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Privacy.css";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", padding: "30px 15px", background: "#f4f4f4", minHeight: "80vh" }}>
      <div className="privacy-box">
        <h1>About Us</h1>

        <p>Welcome to <strong>Shiv247</strong> — your trusted online gaming platform. We are committed to providing a safe, fair, and entertaining gaming experience for all our users.</p>

        <h2>Who We Are</h2>
        <p>Shiv247 is an online gaming platform based in India, offering a wide range of exciting games including casino games, card games, and more. Our platform is designed to deliver a seamless and enjoyable experience to players of all levels.</p>

        <h2>Our Mission</h2>
        <p>Our mission is to provide a secure and transparent gaming environment where players can enjoy their favorite games with complete peace of mind. We prioritize player safety, fair play, and responsible gaming above all else.</p>

        <h2>Why Choose Us</h2>
        <ul>
          <li>100% safe and encrypted platform</li>
          <li>24x7 customer support via WhatsApp</li>
          <li>Fast and secure deposits & withdrawals</li>
          <li>Wide variety of games</li>
          <li>Fair and transparent gameplay</li>
          <li>Strict 18+ age verification policy</li>
        </ul>

        <h2>Contact Us</h2>
        <p>For any queries or support, feel free to reach out to us:</p>
        <p>By email: <a href="mailto:info@shiv247.com">info@shiv247.com</a></p>
        <p>Website: <a href="https://shiv247.com/">https://shiv247.com/</a></p>

      </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
