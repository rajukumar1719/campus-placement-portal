import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaEnvelope, FaPhone, FaGraduationCap,
    FaBriefcase, FaCheck, FaTimes, FaLock,
    FaClock, FaFilePdf, FaDownload, FaEye,
} from "react-icons/fa";
import "./Applications.css";

const Applications = () => {
    const { isAuthorized, user } = useContext(Context);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            let url = "/applications";
            if (filter) url += `?status=${filter}`;
            const res = await API.get(url);
            setApplications(res.data.applications);
        } catch (error) {
            console.log("Error:", error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const res = await API.put(`/applications/${appId}`, {
                status: newStatus
            });
            toast.success(res.data.message);
            setApplications((prev) =>
                prev.map((app) =>
                    app._id === appId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            applied:     { cls: "ap-badge-applied",     label: "Applied" },
            pending:     { cls: "ap-badge-applied",     label: "Pending" },
            shortlisted: { cls: "ap-badge-shortlisted", label: "Shortlisted" },
            rejected:    { cls: "ap-badge-rejected",    label: "Rejected" },
            selected:    { cls: "ap-badge-selected",    label: "Selected" },
        };
        return map[status] || { cls: "ap-badge-applied", label: status };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="ap-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="ap-page">

                {/* ── Header ── */}
                <div className="ap-header">
                    <div>
                        <h2>All Applications</h2>
                        <p>Manage student applications</p>
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="ap-filter"
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
                    <div className="ap-loading">
                        <div className="ap-spinner"></div>
                        <p>Loading applications...</p>
                    </div>
                ) : applications.length > 0 ? (
                    <>
                        <p className="ap-count">
                            Total: <span>{applications.length}</span> applications
                        </p>

                        <div className="ap-list">
                            {applications.map((app) => {
                                const badge = getStatusBadge(app.status);
                                return (
                                    <div className="ap-card" key={app._id}>

                                        {/* Top Row */}
                                        <div className="ap-card-top">
                                            <div className="ap-student-info">
                                                <div className="ap-avatar">
                                                    {app.student?.name?.charAt(0).toUpperCase() || "S"}
                                                </div>
                                                <div>
                                                    <h3>{app.student?.name || "Student"}</h3>
                                                    <p>
                                                        {app.job?.companyName} — {app.job?.jobTitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`ap-badge ${badge.cls}`}>
                                                {badge.label}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="ap-details">
                                            <span>
                                                <FaEnvelope /> {app.student?.email}
                                            </span>
                                            <span>
                                                <FaPhone /> {app.student?.phone || "N/A"}
                                            </span>
                                            <span>
                                                <FaGraduationCap /> {app.student?.branch || "N/A"}
                                            </span>
                                            <span>
                                                <FaGraduationCap /> CGPA: {app.student?.cgpa || "N/A"}
                                            </span>
                                            <span>
                                                <FaClock /> {formatDate(app.createdAt)}
                                            </span>
                                        </div>

                                        {/* Resume */}
                                        <div className="ap-resume">
                                            {app.student?.resume ? (
                                                <div className="ap-resume-row">
                                                    <span className="ap-resume-label">
                                                        <FaFilePdf /> Resume
                                                    </span>
                                                    <div className="ap-resume-btns">
                                                        <a
                                                            href={app.student.resume}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="ap-view-btn"
                                                        >
                                                            <FaEye /> View
                                                        </a>
                                                        <a
                                                            href={app.student.resume}
                                                            download
                                                            className="ap-download-btn"
                                                        >
                                                            <FaDownload /> Download
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="ap-no-resume">
                                                    <FaFilePdf /> No resume uploaded
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="ap-actions">
                                            <button
                                                className="ap-shortlist"
                                                onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                                                disabled={app.status === "shortlisted"}
                                            >
                                                <FaCheck /> Shortlist
                                            </button>
                                            <button
                                                className="ap-select"
                                                onClick={() => handleStatusUpdate(app._id, "selected")}
                                                disabled={app.status === "selected"}
                                            >
                                                <FaCheck /> Select
                                            </button>
                                            <button
                                                className="ap-reject"
                                                onClick={() => handleStatusUpdate(app._id, "rejected")}
                                                disabled={app.status === "rejected"}
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="ap-empty">
                        <FaBriefcase />
                        <h3>No Applications Found</h3>
                        <p>No applications received yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Applications;