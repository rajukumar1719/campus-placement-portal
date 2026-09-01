import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import API from "../../api/axios";
import {
    FaBriefcase, FaFileAlt, FaUser, FaBell,
    FaCheckCircle, FaClock, FaTimesCircle,
    FaArrowRight, FaGraduationCap, FaExclamationCircle,
    FaCalendarAlt, FaMapMarkerAlt, FaStar,
} from "react-icons/fa";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { user } = useContext(Context);
    const [stats, setStats] = useState({
        totalApplications: 0,
        pending: 0,
        shortlisted: 0,
        rejected: 0,
        selected: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appRes, jobRes, notifRes] = await Promise.all([
                API.get("/applications/my"),
                API.get("/jobs"),
                API.get("/notifications"),
            ]);

            const apps = appRes.data.applications || [];

            setStats({
                totalApplications: apps.length,
                pending: apps.filter(a =>
                    a.status === "applied" || a.status === "pending"
                ).length,
                shortlisted: apps.filter(a => a.status === "shortlisted").length,
                rejected: apps.filter(a => a.status === "rejected").length,
                selected: apps.filter(a => a.status === "selected").length,
            });

            setRecentApplications(apps.slice(0, 4));
            setRecentJobs(jobRes.data.jobs?.slice(0, 4) || []);
            setNotifications(notifRes.data.notifications?.slice(0, 5) || []);

        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short"
        })} ${date.getFullYear()}`;
    };

    const getStatusBadge = (status) => {
        const map = {
            selected:    { label: "Selected",    cls: "badge-selected" },
            shortlisted: { label: "Shortlisted", cls: "badge-shortlisted" },
            rejected:    { label: "Rejected",    cls: "badge-rejected" },
            applied:     { label: "Applied",     cls: "badge-applied" },
            pending:     { label: "Pending",     cls: "badge-applied" },
        };
        return map[status] || { label: status, cls: "badge-applied" };
    };

    if (loading) {
        return (
            <div className="db-page">
                <div className="db-loading">
                    <div className="db-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="db-page">

            {/* ── Welcome Bar ── */}
            <div className="db-welcome">
                <div className="db-welcome-left">
                    <div className="db-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div>
                        <h1>Hello, {user?.name?.split(" ")[0]} 👋</h1>
                        <p>Welcome to your placement dashboard</p>
                    </div>
                </div>

                {!user?.profileComplete && (
                    <Link to="/profile" className="db-alert">
                        <FaExclamationCircle />
                        Complete your profile to apply for jobs
                        <span>Fix Now →</span>
                    </Link>
                )}
            </div>

            {/* ── Stats ── */}
            <div className="db-stats">
                <div className="db-stat-card">
                    <div className="db-stat-icon icon-blue">
                        <FaFileAlt />
                    </div>
                    <div>
                        <h2>{stats.totalApplications}</h2>
                        <p>Total Applied</p>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon icon-yellow">
                        <FaClock />
                    </div>
                    <div>
                        <h2>{stats.pending}</h2>
                        <p>Under Review</p>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon icon-green">
                        <FaStar />
                    </div>
                    <div>
                        <h2>{stats.shortlisted}</h2>
                        <p>Shortlisted</p>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon icon-purple">
                        <FaGraduationCap />
                    </div>
                    <div>
                        <h2>{stats.selected}</h2>
                        <p>Selected</p>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon icon-red">
                        <FaTimesCircle />
                    </div>
                    <div>
                        <h2>{stats.rejected}</h2>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="db-grid">

                {/* ===== Left Column ===== */}
                <div className="db-left">

                    {/* Latest Jobs */}
                    <div className="db-card">
                        <div className="db-card-top">
                            <h3><FaBriefcase /> Latest Jobs</h3>
                            <Link to="/jobs">View All <FaArrowRight /></Link>
                        </div>

                        {recentJobs.length > 0 ? (
                            <div className="db-job-list">
                                {recentJobs.map(job => (
                                    <Link
                                        to={`/job/${job._id}`}
                                        className="db-job-row"
                                        key={job._id}
                                    >
                                        <div className="db-job-initial">
                                            {job.companyName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="db-job-info">
                                            <h4>{job.jobTitle}</h4>
                                            <p>{job.companyName}</p>
                                            <div className="db-job-meta">
                                                <span>
                                                    <FaMapMarkerAlt /> {job.location}
                                                </span>
                                                <span>{job.jobType}</span>
                                            </div>
                                        </div>
                                        <div className="db-job-date">
                                            <span>Deadline</span>
                                            <p>{formatDate(job.deadline)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="db-empty">
                                <FaBriefcase />
                                <p>No jobs available</p>
                                <Link to="/jobs">Browse Jobs</Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Applications */}
                    <div className="db-card">
                        <div className="db-card-top">
                            <h3><FaFileAlt /> My Applications</h3>
                            <Link to="/applications/me">
                                View All <FaArrowRight />
                            </Link>
                        </div>

                        {recentApplications.length > 0 ? (
                            <div className="db-app-list">
                                {recentApplications.map(app => {
                                    const badge = getStatusBadge(app.status);
                                    return (
                                        <div className="db-app-row" key={app._id}>
                                            <div className="db-app-initial">
                                                {app.job?.companyName?.charAt(0) || "?"}
                                            </div>
                                            <div className="db-app-info">
                                                <h4>{app.job?.jobTitle || "Job"}</h4>
                                                <p>{app.job?.companyName || "Company"}</p>
                                                <span className="db-app-date">
                                                    {formatDate(app.createdAt)}
                                                </span>
                                            </div>
                                            <span className={`db-badge ${badge.cls}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="db-empty">
                                <FaFileAlt />
                                <p>No applications yet</p>
                                <Link to="/jobs">Apply Now</Link>
                            </div>
                        )}
                    </div>

                    {/* ✅ Notifications - Ab left column mein applications ke niche */}
                    <div className="db-card">
                        <div className="db-card-top">
                            <h3><FaBell /> Notifications</h3>
                            <Link to="/notifications">
                                View All <FaArrowRight />
                            </Link>
                        </div>

                        {notifications.length > 0 ? (
                            <div className="db-notif-list">
                                {notifications.map(notif => (
                                    <div className="db-notif-row" key={notif._id}>
                                        <div className="db-notif-dot"></div>
                                        <div className="db-notif-text">
                                            <h4>{notif.title}</h4>
                                            <p>
                                                {notif.message?.length > 80
                                                    ? notif.message.slice(0, 80) + "..."
                                                    : notif.message}
                                            </p>
                                            <span>{formatDate(notif.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="db-empty">
                                <FaBell />
                                <p>No notifications</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Right Column ===== */}
                <div className="db-right">

                    {/* Quick Links */}
                    <div className="db-card">
                        <div className="db-card-top">
                            <h3>Quick Links</h3>
                        </div>
                        <div className="db-links">
                            <Link to="/jobs" className="db-link-row">
                                <div className="db-link-icon lnk-blue">
                                    <FaBriefcase />
                                </div>
                                <div className="db-link-text">
                                    <span>Browse Jobs</span>
                                    <small>Find opportunities</small>
                                </div>
                                <FaArrowRight />
                            </Link>

                            <Link to="/applications/me" className="db-link-row">
                                <div className="db-link-icon lnk-green">
                                    <FaFileAlt />
                                </div>
                                <div className="db-link-text">
                                    <span>My Applications</span>
                                    <small>Track status</small>
                                </div>
                                <FaArrowRight />
                            </Link>

                            <Link to="/profile" className="db-link-row">
                                <div className="db-link-icon lnk-yellow">
                                    <FaUser />
                                </div>
                                <div className="db-link-text">
                                    <span>My Profile</span>
                                    <small>Update details</small>
                                </div>
                                <FaArrowRight />
                            </Link>

                            <Link to="/interviews" className="db-link-row">
                                <div className="db-link-icon lnk-purple">
                                    <FaCalendarAlt />
                                </div>
                                <div className="db-link-text">
                                    <span>Interviews</span>
                                    <small>Scheduled interviews</small>
                                </div>
                                <FaArrowRight />
                            </Link>

                            <Link to="/notifications" className="db-link-row">
                                <div className="db-link-icon lnk-red">
                                    <FaBell />
                                </div>
                                <div className="db-link-text">
                                    <span>Notifications</span>
                                    <small>Latest updates</small>
                                </div>
                                <FaArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="db-card db-profile-box">
                        <div className="db-profile-head">
                            <div className="db-profile-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4>{user?.name}</h4>
                                <p>{user?.email}</p>
                                <span className={
                                    user?.profileComplete
                                        ? "db-profile-status complete"
                                        : "db-profile-status incomplete"
                                }>
                                    {user?.profileComplete
                                        ? "✓ Profile Complete"
                                        : "⚠ Incomplete"}
                                </span>
                            </div>
                        </div>

                        <div className="db-profile-nums">
                            <div>
                                <strong>{stats.totalApplications}</strong>
                                <span>Applied</span>
                            </div>
                            <div>
                                <strong>{stats.shortlisted}</strong>
                                <span>Shortlisted</span>
                            </div>
                            <div>
                                <strong>{stats.selected}</strong>
                                <span>Selected</span>
                            </div>
                        </div>

                        <Link to="/profile" className="db-profile-link">
                            {user?.profileComplete ? "View Profile" : "Complete Profile"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;