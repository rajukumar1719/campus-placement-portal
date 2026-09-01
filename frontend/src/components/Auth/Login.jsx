import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            // ✅ Save Token & User in LocalStorage
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // ✅ Context State update
            setUser(res.data.user);
            setIsAuthorized(true);

            toast.success(res.data.message || "Login successful");

            // Direct Navigation
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
                <h1>🎓 PlaceMe</h1>
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
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

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="signup-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;