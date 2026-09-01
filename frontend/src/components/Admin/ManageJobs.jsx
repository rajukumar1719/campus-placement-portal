import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaEdit, FaTrash, FaPlus, FaMapMarkerAlt,
    FaCalendarAlt, FaBriefcase, FaLock,
    FaUsers, FaMoneyBillWave, FaSearch,
} from "react-icons/fa";
import "./ManageJobs.css";

const ManageJobs = () => {
    const { isAuthorized, user } = useContext(Context);
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await API.get("/jobs/admin/all");
                setJobs(res.data.jobs || []);
                setFiltered(res.data.jobs || []);
            } catch (error) {
                console.log("Error:", error);
                setJobs([]);
                setFiltered([]);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthorized && user?.role === "admin") {
            fetchJobs();
        }
    }, [isAuthorized, user]);

    // ✅ Search + Filter
    useEffect(() => {
        let result = jobs;

        if (search) {
            result = result.filter(job =>
                job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                job.companyName.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            result = result.filter(job => job.status === statusFilter);
        }

        setFiltered(result);
    }, [search, statusFilter, jobs]);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Delete this job?")) return;
        try {
            const res = await API.delete(`/jobs/${jobId}`);
            toast.success(res.data.message);
            setJobs(prev => prev.filter(j => j._id !== jobId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short"
        })} ${date.getFullYear()}`;
    };

    const isExpired = (deadline) => new Date(deadline) < new Date();

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="mj-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mj-page">

                {/* ── Header ── */}
                <div className="mj-header">
                    <div>
                        <h2>Manage Jobs</h2>
                        <p>View, edit or delete job listings</p>
                    </div>
                    <Link to="/admin/jobs/create" className="mj-create-btn">
                        <FaPlus /> Post Job
                    </Link>
                </div>

                {/* ── Search + Filter ── */}
                <div className="mj-toolbar">
                    <div className="mj-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by title or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mj-filter"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {loading ? (
                    <div className="mj-loading">
                        <div className="mj-spinner"></div>
                        <p>Loading jobs...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <>
                        {/* Count */}
                        <p className="mj-count">
                            Showing <span>{filtered.length}</span> of{" "}
                            <span>{jobs.length}</span> jobs
                        </p>

                        {/* Job List */}
                        <div className="mj-list">
                            {filtered.map((job) => (
                                <div className="mj-item" key={job._id}>

                                    {/* Left - Logo */}
                                    <div className="mj-logo">
                                        {job.companyName?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Middle - Info */}
                                    <div className="mj-info">
                                        <div className="mj-info-top">
                                            <h3>{job.jobTitle}</h3>
                                            <span className={`mj-status ${job.status}`}>
                                                {job.status}
                                            </span>
                                            {isExpired(job.deadline) && job.status === "active" && (
                                                <span className="mj-status expired">
                                                    Expired
                                                </span>
                                            )}
                                        </div>

                                        <p className="mj-company">{job.companyName}</p>

                                        <div className="mj-meta">
                                            <span>
                                                <FaMapMarkerAlt /> {job.location}
                                            </span>
                                            <span>
                                                <FaBriefcase /> {job.jobType}
                                            </span>
                                            <span>
                                                <FaMoneyBillWave /> {job.salary}
                                            </span>
                                            <span>
                                                <FaUsers /> {job.applicationCount || 0} applied
                                            </span>
                                            <span>
                                                <FaCalendarAlt /> Deadline: {formatDate(job.deadline)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right - Actions */}
                                    <div className="mj-actions">
                                        <Link
                                            to={`/admin/jobs/edit/${job._id}`}
                                            className="mj-edit-btn"
                                        >
                                            <FaEdit /> Edit
                                        </Link>
                                        <button
                                            className="mj-delete-btn"
                                            onClick={() => handleDelete(job._id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="mj-empty">
                        <FaBriefcase />
                        <h3>
                            {search || statusFilter
                                ? "No jobs match your search"
                                : "No Jobs Posted Yet"}
                        </h3>
                        <p>
                            {search || statusFilter
                                ? "Try different keywords"
                                : "Start by creating your first job listing"}
                        </p>
                        {!search && !statusFilter && (
                            <Link to="/admin/jobs/create" className="mj-create-btn">
                                <FaPlus /> Post Job
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageJobs;