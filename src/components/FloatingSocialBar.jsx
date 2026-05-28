import React from "react";
import { FaWhatsapp, FaTelegramPlane, FaHeadset } from "react-icons/fa";
import "./FloatingSocialBar.css";

const buttons = [
  {
    label: "WhatsApp",
    Icon: FaWhatsapp,
    href: "https://wa.me/your-number",
    cls: "fsb-whatsapp",
  },
  {
    label: "Telegram",
    Icon: FaTelegramPlane,
    href: "https://t.me/your-username",
    cls: "fsb-telegram",
  },
  {
    label: "Support",
    Icon: FaHeadset,
    href: "#support",
    cls: "fsb-support",
  },
];

const FloatingSocialBar = () => (
  <div className="fsb-wrapper">
    {buttons.map(({ label, Icon, href, cls }) => (
      <a key={label} href={href} className={`fsb-btn ${cls}`} target="_blank" rel="noreferrer">
        <Icon className="fsb-icon" />
        <span>{label}</span>
      </a>
    ))}
  </div>
);

export default FloatingSocialBar;
