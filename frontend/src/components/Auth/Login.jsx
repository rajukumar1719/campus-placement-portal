import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import { FaGraduationCap, FaUserShield } from "react-icons/fa";
import "./Login.css";

const Login = () => {
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState(searchParams.get("role") === "admin" ? "admin" : "student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setIsAuthorized, setUser, isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorized && user) {
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/jobs");
            }
        }
    }, [isAuthorized, user, navigate]);

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            if (role === "admin" && res.data.user?.role !== "admin") {
                toast.error("This account does not have administrator privileges.");
                setLoading(false);
                return;
            }

            // Save Token & User in LocalStorage
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setUser(res.data.user);
            setIsAuthorized(true);

            toast.success(res.data.message || `${role === "admin" ? "Admin" : "Student"} login successful`);

            if (res.data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>🎓 CampusHire</h1>
                <h2>{role === "admin" ? "Administrator Portal Login" : "Student Portal Login"}</h2>

                {/* Role Toggle Tabs */}
                <div className="login-role-tabs">
                    <button
                        type="button"
                        className={`role-tab ${role === "student" ? "active" : ""}`}
                        onClick={() => handleRoleSwitch("student")}
                    >
                        <FaGraduationCap /> Student Login
                    </button>
                    <button
                        type="button"
                        className={`role-tab ${role === "admin" ? "active" : ""}`}
                        onClick={() => handleRoleSwitch("admin")}
                    >
                        <FaUserShield /> Admin Login
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{role === "admin" ? "Admin Email" : "Student Email"}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === "admin" ? "Enter admin email (e.g. admin@campushire.com)" : "Enter your student email"}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{role === "admin" ? "Admin Password" : "Password"}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <p className="forgot-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </p>

                    <button
                        type="submit"
                        className={`login-btn ${role === "admin" ? "admin-mode" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : (role === "admin" ? "Login as an Admin" : "Login as Student")}
                    </button>

                    {role === "student" ? (
                        <>
                            <div className="login-divider">
                                <span>OR</span>
                            </div>

                            <button
                                type="button"
                                className="login-admin-btn"
                                onClick={() => handleRoleSwitch("admin")}
                            >
                                <FaUserShield /> Login as an Admin
                            </button>
                        </>
                    ) : (
                        <div className="admin-credentials-hint">
                            <p>
                                💡 Default Admin: <strong>admin@campushire.com</strong> / <strong>Admin@123</strong>
                            </p>
                            <button
                                type="button"
                                className="fill-demo-text-btn"
                                onClick={() => {
                                    setEmail("admin@campushire.com");
                                    setPassword("Admin@123");
                                }}
                            >
                                Auto-fill admin credentials
                            </button>
                        </div>
                    )}
                </form>

                {role === "student" ? (
                    <p className="signup-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                ) : (
                    <p className="signup-link">
                        Are you a student?{" "}
                        <button
                            type="button"
                            className="switch-link-btn"
                            onClick={() => handleRoleSwitch("student")}
                        >
                            Switch to Student Login
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;