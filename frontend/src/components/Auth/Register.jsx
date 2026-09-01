import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setIsAuthorized, setUser, isAuthorized } = useContext(Context);
    const navigate = useNavigate();

    // ✅ FIX: useEffect mein move kiya
    useEffect(() => {
        if (isAuthorized) {
            navigate("/jobs");
        }
    }, [isAuthorized, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/signup", {
                name,
                email,
                password,
            });

            // ✅ REMOVED: localStorage.setItem("token", ...)
            // ✅ Only save user data
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // ✅ State update
            setUser(res.data.user);
            setIsAuthorized(true);

            toast.success(res.data.message || "Registration successful");

            // Navigation handled by useEffect
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>🎓 PlaceMe</h1>
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

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
                            placeholder="Enter password (min 6 chars)"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="login-link">
                    <span style={{color : "black"}}>Already have an account?</span> <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;