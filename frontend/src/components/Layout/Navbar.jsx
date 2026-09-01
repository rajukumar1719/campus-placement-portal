import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaBell } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
    const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
    const [showMenu, setShowMenu] = useState(false);
    const navigateTo = useNavigate();
    const location = useLocation();

    // ✅ FIX: isActive function add kiya
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Admin pages pe navbar hide
    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Logout error:", error);
        }
        localStorage.removeItem("user");
        setIsAuthorized(false);
        setUser({});
        navigateTo("/login");
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="logo">
                <Link to={isAuthorized ? "/dashboard" : "/"}>
                    🎓 Campus<span>Hire</span>
                </Link>
            </div>

            {/* Menu */}
            <div className={`menu ${showMenu ? "active" : ""}`}>

                {/* Public Links */}
                {!isAuthorized && (
                    <Link
                        to="/"
                        className={isActive("/") ? "active-link" : ""}
                        onClick={() => setShowMenu(false)}
                    >
                        Home
                    </Link>
                )}

                        <Link
                            to="/dashboard"
                            className={isActive("/dashboard") ? "active-link" : ""}
                            onClick={() => setShowMenu(false)}
                        >
                            Dashboard
                        </Link>
                <Link
                    to="/jobs"
                    className={isActive("/jobs") ? "active-link" : ""}
                    onClick={() => setShowMenu(false)}
                >
                    Jobs
                </Link>

                {/* Student Links */}
                {isAuthorized && user?.role === "student" && (
                    <>

                        <Link
                            to="/applications/me"
                            className={isActive("/applications/me") ? "active-link" : ""}
                            onClick={() => setShowMenu(false)}
                        >
                            My Applications
                        </Link>

                        <Link
                            to="/interviews"
                            className={isActive("/interviews") ? "active-link" : ""}
                            onClick={() => setShowMenu(false)}
                        >
                            Interviews
                        </Link>

                        <Link
                            to="/profile"
                            className={isActive("/profile") ? "active-link" : ""}
                            onClick={() => setShowMenu(false)}
                        >
                            Profile
                        </Link>

                        <Link
                            to="/saved-jobs"
                            className={isActive("/saved-jobs") ? "active-link" : ""}
                            onClick={() => setShowMenu(false)}
                        >
                            Saved Jobs
                        </Link>

                        <Link
                            to="/notifications"
                            className={`notif-link ${isActive("/notifications") ? "active-link" : ""}`}
                            onClick={() => setShowMenu(false)}
                        >
                            <FaBell />
                        </Link>
                    </>
                )}

                {/* Admin Link */}
                {isAuthorized && user?.role === "admin" && (
                    <Link
                        to="/admin"
                        onClick={() => setShowMenu(false)}
                    >
                        Admin Panel
                    </Link>
                )}

                {/* Auth Buttons */}
                {isAuthorized ? (
                    <div className="auth-section">
                        <span className="user-name">
                            Hi, {user?.name?.split(' ')[0]}
                        </span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link
                            to="/login"
                            className="login-link"
                            onClick={() => setShowMenu(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="register-link"
                            onClick={() => setShowMenu(false)}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>

            {/* Hamburger */}
            <div className="hamburger" onClick={() => setShowMenu(!showMenu)}>
                {showMenu ? <FaTimes /> : <GiHamburgerMenu />}
            </div>
        </nav>
    );
};

export default Navbar;