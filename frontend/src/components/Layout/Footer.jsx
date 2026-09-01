import React from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const location = useLocation();

    // ✅ Admin pages pe footer hide
    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2025 PlaceMe. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;