import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import {
    FaUser, FaEnvelope, FaPhone, FaGraduationCap,
    FaBriefcase, FaSearch, FaLock, FaCheck, FaTimes,
} from "react-icons/fa";
import "./Application.css";

const Application = () => {
    const { isAuthorized, user } = useContext(Context);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    // Fetch all applications (Admin)
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                let url = "/applications";
                if (statusFilter) {
                    url += `?status=${statusFilter}`;
                }
                const response = await API.get(url);
                setApplications(response.data.applications);
            } catch (error) {
                console.log("Error:", error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthorized) {
            fetchApplications();
        }
    }, [isAuthorized, statusFilter]);

    // Update status
    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const response = await API.put(`/applications/${appId}`, {
                status: newStatus,
            });
            toast.success(response.data.message);

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === appId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    // Status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "applied": return "#f39c12";
            case "pending": return "#f39c12";
            case "shortlisted": return "#27ae60";
            case "rejected": return "#e74c3c";
            case "selected": return "#2ecc71";
            default: return "#666";
        }
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user && user.role !== "admin") {
        return (
            <div className="application-page">
                <div className="not-authorized">
                    <div className="icon"><FaLock /></div>
                    <h3>Access Denied</h3>
                    <p>Only Admin can view all applications.</p>
                    <Link to="/jobs" className="go-btn">Browse Jobs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="application-page">
            <div className="page-header">
                <h2>All Applications</h2>
                <p>View and manage student applications</p>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="selected">Selected</option>
                </select>
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

                    {applications.map((app) => (
                        <div className="application-card" key={app._id}>
                            <div className="card-header">
                                <div>
                                    <h3>{app.student?.name || "Student"}</h3>
                                    <p>{app.job?.companyName} - {app.job?.jobTitle}</p>
                                </div>
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(app.status) }}
                                >
                                    {app.status}
                                </span>
                            </div>

                            <div className="info-grid">
                                <div className="info-item">
                                    <FaEnvelope /> {app.student?.email}
                                </div>
                                <div className="info-item">
                                    <FaPhone /> {app.student?.phone || "N/A"}
                                </div>
                                <div className="info-item">
                                    <FaGraduationCap /> Branch: {app.student?.branch || "N/A"}
                                </div>
                                <div className="info-item">
                                    <FaGraduationCap /> CGPA: {app.student?.cgpa || "N/A"}
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="shortlist-btn"
                                    onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                                >
                                    <FaCheck /> Shortlist
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => handleStatusUpdate(app._id, "rejected")}
                                >
                                    <FaTimes /> Reject
                                </button>
                                <button
                                    className="select-btn"
                                    onClick={() => handleStatusUpdate(app._id, "selected")}
                                >
                                    <FaCheck /> Select
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="no-applications">
                    <div className="icon"><FaSearch /></div>
                    <h3>No Applications Found</h3>
                    <p>No applications received yet.</p>
                </div>
            )}
        </div>
    );
};

export default Application;