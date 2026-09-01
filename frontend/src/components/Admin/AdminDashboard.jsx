import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaUsers, FaBriefcase, FaFileAlt,
    FaCheckCircle, FaTimesCircle, FaClock,
    FaPlus, FaBell, FaLock, FaArrowRight,
    FaStar, FaChartBar,
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const { isAuthorized, user } = useContext(Context);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/admin/stats");
                setStats(res.data.stats);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthorized && user?.role === "admin") {
            fetchStats();
        }
    }, [isAuthorized, user]);

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user && user.role !== "admin") {
        return (
            <div className="ad-denied">
                <FaLock />
                <h2>Access Denied</h2>
                <p>Only administrators can access this page.</p>
                <Link to="/jobs">Go to Jobs</Link>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="ad-page">

                {/* ── Welcome Bar ── */}
                <div className="ad-welcome">
                    <div className="ad-welcome-left">
                        <div className="ad-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1>Welcome, {user?.name?.split(" ")[0]} 👋</h1>
                            <p>Placement portal overview</p>
                        </div>
                    </div>
                    <div className="ad-welcome-actions">
                        <Link to="/admin/jobs/create" className="ad-btn-primary">
                            <FaPlus /> Post Job
                        </Link>
                        <Link to="/admin/notifications" className="ad-btn-secondary">
                            <FaBell /> Notify
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="ad-loading">
                        <div className="ad-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* ── Stats Row ── */}
                        <div className="ad-section-title">
                            <FaChartBar />
                            <h2>Overview</h2>
                        </div>

                        <div className="ad-stats">
                            <div className="ad-stat">
                                <div className="ad-stat-icon blue">
                                    <FaUsers />
                                </div>
                                <div>
                                    <h3>{stats?.totalStudents || 0}</h3>
                                    <p>Total Students</p>
                                </div>
                            </div>

                            <div className="ad-stat">
                                <div className="ad-stat-icon purple">
                                    <FaBriefcase />
                                </div>
                                <div>
                                    <h3>{stats?.totalJobs || 0}</h3>
                                    <p>Total Jobs</p>
                                </div>
                            </div>

                            <div className="ad-stat">
                                <div className="ad-stat-icon green">
                                    <FaFileAlt />
                                </div>
                                <div>
                                    <h3>{stats?.totalApplications || 0}</h3>
                                    <p>Applications</p>
                                </div>
                            </div>

                            <div className="ad-stat">
                                <div className="ad-stat-icon orange">
                                    <FaClock />
                                </div>
                                <div>
                                    <h3>{stats?.pendingApplications || 0}</h3>
                                    <p>Pending</p>
                                </div>
                            </div>

                            <div className="ad-stat">
                                <div className="ad-stat-icon teal">
                                    <FaStar />
                                </div>
                                <div>
                                    <h3>{stats?.shortlistedApplications || 0}</h3>
                                    <p>Shortlisted</p>
                                </div>
                            </div>

                            <div className="ad-stat">
                                <div className="ad-stat-icon red">
                                    <FaTimesCircle />
                                </div>
                                <div>
                                    <h3>{stats?.rejectedApplications || 0}</h3>
                                    <p>Rejected</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Quick Actions ── */}
                        <div className="ad-section-title">
                            <FaArrowRight />
                            <h2>Quick Actions</h2>
                        </div>

                        <div className="ad-actions">
                            <Link to="/admin/jobs" className="ad-action">
                                <div className="ad-action-icon red">
                                    <FaBriefcase />
                                </div>
                                <div className="ad-action-text">
                                    <span>Manage Jobs</span>
                                    <small>View, edit or delete listings</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>

                            <Link to="/admin/applications" className="ad-action">
                                <div className="ad-action-icon teal">
                                    <FaFileAlt />
                                </div>
                                <div className="ad-action-text">
                                    <span>Applications</span>
                                    <small>Review and manage</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>

                            <Link to="/admin/students" className="ad-action">
                                <div className="ad-action-icon purple">
                                    <FaUsers />
                                </div>
                                <div className="ad-action-text">
                                    <span>Students</span>
                                    <small>View registered students</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>

                            <Link to="/admin/notifications" className="ad-action">
                                <div className="ad-action-icon orange">
                                    <FaBell />
                                </div>
                                <div className="ad-action-text">
                                    <span>Notifications</span>
                                    <small>Send announcements</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>

                            <Link to="/admin/interviews" className="ad-action">
                                <div className="ad-action-icon blue">
                                    <FaCheckCircle />
                                </div>
                                <div className="ad-action-text">
                                    <span>Interviews</span>
                                    <small>Schedule and manage</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>

                            <Link to="/admin/analytics" className="ad-action">
                                <div className="ad-action-icon green">
                                    <FaChartBar />
                                </div>
                                <div className="ad-action-text">
                                    <span>Analytics</span>
                                    <small>View detailed reports</small>
                                </div>
                                <FaArrowRight className="ad-action-arrow" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;