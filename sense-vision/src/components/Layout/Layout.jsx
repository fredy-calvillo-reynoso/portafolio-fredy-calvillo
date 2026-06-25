// src/components/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsApp/WhatsAppButton";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="sv-app-shell">
      <Navbar />
      <main className="sv-main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}