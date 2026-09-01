import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FaLock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import "./ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post(`/auth/reset-password/${token}`, {
                password,
                confirmPassword
            });
            toast.success(res.data.message);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed");
        }
        setLoading(false);
    };

    return (
        <div className="reset-container">
            <div className="reset-card">

                {!success ? (
                    <>
                        <div className="reset-icon">🔐</div>
                        <h1>Reset Password</h1>
                        <p>Enter your new password below</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><FaLock /> New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label><FaLock /> Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {password && confirmPassword && (
                                <div className={`match-status ${password === confirmPassword ? 'match' : 'no-match'}`}>
                                    {password === confirmPassword
                                        ? "✅ Passwords match"
                                        : "❌ Passwords don't match"
                                    }
                                </div>
                            )}

                            <button type="submit" className="reset-submit-btn" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>

                        <Link to="/login" className="back-to-login">
                            <FaArrowLeft /> Back to Login
                        </Link>
                    </>
                ) : (
                    <div className="reset-success">
                        <div className="success-icon"><FaCheckCircle /></div>
                        <h2>Password Reset Successful!</h2>
                        <p>Redirecting to login page...</p>
                        <Link to="/login" className="login-now-btn">
                            Login Now →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;