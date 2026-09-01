import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
    FaChartBar, FaTachometerAlt, FaBriefcase,
    FaFileAlt, FaUsers, FaBell, FaSignOutAlt,
    FaUserShield, FaPlus, FaCalendarAlt,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
    const { setIsAuthorized, setUser, user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
        } catch (error) {
            console.log("Logout error:", error);
        }
        localStorage.removeItem("token");
        setIsAuthorized(false);
        setUser({});
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const navItems = [
        {
            to: "/admin",
            icon: <FaTachometerAlt />,
            label: "Dashboard",
            exact: true
        },
        {
            to: "/admin/jobs",
            icon: <FaBriefcase />,
            label: "Manage Jobs"
        },
        {
            to: "/admin/jobs/create",
            icon: <FaPlus />,
            label: "Post Job"
        },
        {
            to: "/admin/applications",
            icon: <FaFileAlt />,
            label: "Applications"
        },
        {
            to: "/admin/students",
            icon: <FaUsers />,
            label: "Students"
        },
        {
            to: "/admin/interviews",
            icon: <FaCalendarAlt />,
            label: "Interviews"
        },
        {
            to: "/admin/notifications",
            icon: <FaBell />,
            label: "Notifications"
        },
        // {
        //     to: "/admin/analytics",
        //     icon: <FaChartBar />,
        //     label: "Analytics"
        // },
    ];

    return (
        <div className="as-sidebar">

            {/* ── Logo ── */}
            <div className="as-logo-wrap">
                <Link to="/admin" className="as-logo">
                    🎓 CampusHire
                </Link>
                <div className="as-badge">
                    <FaUserShield />
                    <span>Admin</span>
                </div>
            </div>

            {/* ── User Info ── */}
            <div className="as-user">
                <div className="as-user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="as-user-info">
                    <h4>{user?.name || "Admin"}</h4>
                    <p>{user?.email || "admin@campushire.com"}</p>
                </div>
            </div>

            {/* ── Nav ── */}
            <nav className="as-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`as-nav-link ${
                            item.exact
                                ? location.pathname === item.to
                                    ? "active"
                                    : ""
                                : isActive(item.to)
                                    ? "active"
                                    : ""
                        }`}
                    >
                        <span className="as-nav-icon">{item.icon}</span>
                        <span className="as-nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* ── Logout ── */}
            <button className="as-logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default AdminSidebar;