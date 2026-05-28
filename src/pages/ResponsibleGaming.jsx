import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Privacy.css";

const ResponsibleGaming = () => {
  return (
    <div>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", padding: "30px 15px", background: "#f4f4f4", minHeight: "80vh" }}>
      <div className="privacy-box">
        <h1>Responsible Gaming</h1>

        <p>At Shiv247, we are committed to promoting responsible gaming. We want our players to enjoy gaming as a form of entertainment, not as a way to make money or escape problems.</p>

        <h2>Play Responsibly</h2>
        <p>Gaming should always be fun. Here are some tips to keep it that way:</p>
        <ul>
          <li>Set a budget before you start playing and stick to it.</li>
          <li>Never chase your losses.</li>
          <li>Take regular breaks during gaming sessions.</li>
          <li>Do not play when you are stressed, upset, or under the influence of alcohol.</li>
          <li>Balance gaming with other activities and responsibilities.</li>
        </ul>

        <h2>Age Restriction</h2>
        <p>Shiv247 strictly prohibits anyone under the age of 18 from using our platform. We take age verification seriously and reserve the right to request proof of age at any time.</p>

        <h2>Self-Exclusion</h2>
        <p>If you feel that gaming is negatively affecting your life, you can request a self-exclusion from our platform. During this period, you will not be able to access your account or place any bets. To request self-exclusion, please contact our support team.</p>

        <h2>Deposit Limits</h2>
        <p>We encourage players to set daily, weekly, or monthly deposit limits to help manage their spending. Contact our support team to set or update your limits.</p>

        <h2>Seek Help</h2>
        <p>If you or someone you know has a gambling problem, please seek help immediately. There are several organizations that can provide support and guidance.</p>

        <h2>Contact Us</h2>
        <p>If you have any concerns about your gaming habits or need assistance, please contact us:</p>
        <p>By email: <a href="mailto:info@shiv247.com">info@shiv247.com</a></p>

      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResponsibleGaming;
