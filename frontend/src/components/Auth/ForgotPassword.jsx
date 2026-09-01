import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "./ForgotPassword.css";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/forgot-password", { email });

            if (res.data.success) {
                toast.success(res.data.message || "Reset link sent!");
                setEmailSent(true);
            }

        } catch (error) {
            const message = error.response?.data?.message || "Failed to send email. Try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Try Again handler
    const handleTryAgain = () => {
        setEmailSent(false);
        setEmail("");
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">

                {/* Back to Login */}
                <Link to="/login" className="back-link">
                    <FaArrowLeft /> Back to Login
                </Link>

                {/* ✅ Form State */}
                {!emailSent ? (
                    <>
                        <div className="forgot-icon">🔐</div>
                        <h1>Forgot Password?</h1>
                        <p className="forgot-subtitle">
                            Enter your email and we'll send you a reset link
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <FaEnvelope /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className="reset-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="spin-icon" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>

                        {/* ✅ Register Link */}
                        <p className="register-link">
                            Don't have an account?{" "}
                            <Link to="/register">Register here</Link>
                        </p>
                    </>

                ) : (
                    // ✅ Email Sent State
                    <div className="email-sent">
                        <div className="sent-icon">
                            <FaCheckCircle />
                        </div>

                        <h2>Email Sent!</h2>

                        <p className="sent-email-text">
                            We've sent a password reset link to
                            <br />
                            <strong>{email}</strong>
                        </p>

                        <div className="sent-instructions">
                            <p>📧 Check your inbox</p>
                            <p>🗂️ Check spam/junk folder too</p>
                            <p>🔗 Click the reset link in email</p>
                            <p>⏰ Link expires in 15 minutes</p>
                        </div>

                        {/* ✅ Try Again Button */}
                        <button
                            className="resend-btn"
                            onClick={handleTryAgain}
                        >
                            Didn't receive? Try again
                        </button>

                        {/* ✅ Back to Login */}
                        <Link to="/login" className="back-to-login-link">
                            Back to Login →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;