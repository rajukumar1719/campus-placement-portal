import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import {
    FaBriefcase, FaMapMarkerAlt, FaCalendarAlt,
    FaMoneyBillWave, FaSearch, FaTimesCircle,
    FaCheckCircle, FaClock, FaGraduationCap,
} from "react-icons/fa";
import "./MyApplications.css";

const MyApplications = () => {
    const { isAuthorized, user } = useContext(Context);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(null);

    // Fetch my applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await API.get("/applications/my");
                setApplications(response.data.applications);
            } catch (error) {
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthorized) {
            fetchApplications();
        }
    }, [isAuthorized]);

    // ✅ Withdraw Application
    const handleWithdraw = async (appId, jobTitle) => {
        const confirm = window.confirm(
            `Are you sure you want to withdraw your application for "${jobTitle}"?\n\nThis action cannot be undone.`
        );
        if (!confirm) return;

        setWithdrawing(appId);
        try {
            const res = await API.delete(`/applications/${appId}/withdraw`);
            toast.success(res.data.message);
            // Remove from list
            setApplications(prev => prev.filter(app => app._id !== appId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to withdraw");
        }
        setWithdrawing(null);
    };

    // Status badge config
    const getStatusConfig = (status) => {
        switch (status) {
            case "applied":
                return { color: "#f39c12", bg: "#fff8e1", icon: <FaClock />, label: "Applied" };
            case "pending":
                return { color: "#f39c12", bg: "#fff8e1", icon: <FaClock />, label: "Pending" };
            case "shortlisted":
                return { color: "#27ae60", bg: "#e8f8f0", icon: <FaCheckCircle />, label: "Shortlisted" };
            case "rejected":
                return { color: "#e74c3c", bg: "#fef0f0", icon: <FaTimesCircle />, label: "Rejected" };
            case "selected":
                return { color: "#6c63ff", bg: "#ede9ff", icon: <FaGraduationCap />, label: "Selected" };
            default:
                return { color: "#666", bg: "#f5f5f5", icon: <FaClock />, label: status };
        }
    };

    // Date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short",
        })} ${date.getFullYear()}`;
    };

    // Can withdraw check
    const canWithdraw = (status) => {
        return ['applied', 'pending'].includes(status);
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    return (
        <div className="my-applications">
            <div className="page-header">
                <h2>My Applications</h2>
                <p>Track and manage your job applications</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading applications...</p>
                </div>
            ) : applications.length > 0 ? (
                <>
                    <p className="app-count">
                        Total <span>{applications.length}</span> applications
                    </p>

                    {applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);

                        return (
                            <div className="application-card" key={app._id}>

                                {/* Card Header */}
                                <div className="card-header">
                                    <div>
                                        <h3>{app.job?.jobTitle || "Job"}</h3>
                                        <p className="company-name">
                                            {app.job?.companyName || "Company"}
                                        </p>
                                    </div>
                                    <div
                                        className="status-badge"
                                        style={{
                                            backgroundColor: statusConfig.bg,
                                            color: statusConfig.color,
                                            border: `1px solid ${statusConfig.color}`
                                        }}
                                    >
                                        {statusConfig.icon}
                                        {statusConfig.label}
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="info-grid">
                                    <div className="info-item">
                                        <FaMapMarkerAlt /> {app.job?.location || "N/A"}
                                    </div>
                                    <div className="info-item">
                                        <FaMoneyBillWave /> {app.job?.salary || "N/A"}
                                    </div>
                                    <div className="info-item">
                                        <FaCalendarAlt /> Applied: {formatDate(app.createdAt)}
                                    </div>
                                    <div className="info-item">
                                        <FaBriefcase /> {app.job?.status || "N/A"}
                                    </div>
                                </div>

                                {/* Status Message */}
                                {app.status === 'shortlisted' && (
                                    <div className="status-message shortlisted">
                                        🎉 Congratulations! You've been shortlisted. Stay tuned for next steps.
                                    </div>
                                )}

                                {app.status === 'selected' && (
                                    <div className="status-message selected">
                                        🏆 Amazing! You've been selected for this position!
                                    </div>
                                )}

                                {app.status === 'rejected' && (
                                    <div className="status-message rejected">
                                        Keep applying! Your next opportunity is waiting.
                                    </div>
                                )}

                                {/* ✅ Withdraw Button */}
                                {canWithdraw(app.status) && (
                                    <div className="card-footer">
                                        <button
                                            className="withdraw-btn"
                                            onClick={() => handleWithdraw(
                                                app._id,
                                                app.job?.jobTitle || "this job"
                                            )}
                                            disabled={withdrawing === app._id}
                                        >
                                            <FaTimesCircle />
                                            {withdrawing === app._id
                                                ? "Withdrawing..."
                                                : "Withdraw Application"
                                            }
                                        </button>
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="no-applications">
                    <div className="icon"><FaSearch /></div>
                    <h3>No Applications Yet</h3>
                    <p>You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="browse-btn">Browse Jobs</Link>
                </div>
            )}
        </div>
    );
};

export default MyApplications;