import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import {
    FaEdit, FaTrash, FaSave, FaTimes,
    FaMapMarkerAlt, FaCalendarAlt, FaBriefcase,
    FaLock, FaPlus,
} from "react-icons/fa";
import "./MyJobs.css";
import AdminLayout from "../Admin/AdminLayout";

const MyJobs = () => {
    const { isAuthorized, user } = useContext(Context);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // Edit form state
    const [editJobTitle, setEditJobTitle] = useState("");
    const [editCompanyName, setEditCompanyName] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editSalary, setEditSalary] = useState("");
    const [editEligibility, setEditEligibility] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // Fetch admin jobs
    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const response = await API.get("/jobs/admin/all");
                setJobs(response.data.jobs);
            } catch (error) {
                console.log("Error fetching jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    // Edit mode ON
    const handleEnableEdit = (job) => {
        setEditingId(job._id);
        setEditJobTitle(job.jobTitle);
        setEditCompanyName(job.companyName);
        setEditLocation(job.location);
        setEditSalary(job.salary);
        setEditEligibility(job.eligibility);
        setEditDescription(job.description);
    };

    // Edit mode OFF
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // Update job
    const handleUpdateJob = async (jobId) => {
        try {
            const response = await API.put(`/jobs/${jobId}`, {
                jobTitle: editJobTitle,
                companyName: editCompanyName,
                location: editLocation,
                salary: editSalary,
                eligibility: editEligibility,
                description: editDescription,
            });

            toast.success(response.data.message);

            setJobs((prev) =>
                prev.map((job) =>
                    job._id === jobId
                        ? {
                            ...job,
                            jobTitle: editJobTitle,
                            companyName: editCompanyName,
                            location: editLocation,
                            salary: editSalary,
                            eligibility: editEligibility,
                            description: editDescription,
                        }
                        : job
                )
            );
            setEditingId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
        }
    };

    // Delete job
    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            const response = await API.delete(`/jobs/${jobId}`);
            toast.success(response.data.message);
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
    };

    // Date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short",
        })} ${date.getFullYear()}`;
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user && user.role !== "admin") {
        return (
            <div className="my-jobs-page">
                <div className="not-authorized">
                    <div className="icon"><FaLock /></div>
                    <h3>Access Denied</h3>
                    <p>Only Admin can view posted jobs.</p>
                    <Link to="/jobs" className="go-btn">Browse Jobs</Link>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
        <div className="my-jobs-page">
            <div className="page-header">
                <h2>My Posted Jobs</h2>
                <p>Manage, edit, or delete your job listings</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your jobs...</p>
                </div>
            ) : jobs.length > 0 ? (
                <>
                    <p className="jobs-count">
                        You have posted <span>{jobs.length}</span> jobs
                    </p>

                    {jobs.map((job) => (
                        <div
                            className={`job-item ${editingId === job._id ? "editing" : ""}`}
                            key={job._id}
                        >
                            {editingId !== job._id ? (
                                <>
                                    <div className="item-top">
                                        <div className="info">
                                            <h3>{job.jobTitle}</h3>
                                            <span className="category-tag">{job.companyName}</span>
                                        </div>
                                    </div>

                                    <div className="item-meta">
                                        <div className="meta"><FaMapMarkerAlt /> {job.location}</div>
                                        <div className="meta"><FaBriefcase /> {job.jobType}</div>
                                        <div className="meta"><FaCalendarAlt /> {formatDate(job.createdAt)}</div>
                                    </div>

                                    <div className="item-salary">
                                        {job.salary}
                                    </div>

                                    <p className="item-desc">{job.description}</p>

                                    <p className="item-desc">
                                        <strong>Applications:</strong> {job.applicationCount || 0}
                                    </p>

                                    <div className="item-actions">
                                        <button className="edit-btn" onClick={() => handleEnableEdit(job)}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteJob(job._id)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="edit-form">
                                        <div className="edit-row">
                                            <div>
                                                <label>Job Title</label>
                                                <input type="text" value={editJobTitle}
                                                    onChange={(e) => setEditJobTitle(e.target.value)} />
                                            </div>
                                            <div>
                                                <label>Company</label>
                                                <input type="text" value={editCompanyName}
                                                    onChange={(e) => setEditCompanyName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="edit-row">
                                            <div>
                                                <label>Location</label>
                                                <input type="text" value={editLocation}
                                                    onChange={(e) => setEditLocation(e.target.value)} />
                                            </div>
                                            <div>
                                                <label>Salary</label>
                                                <input type="text" value={editSalary}
                                                    onChange={(e) => setEditSalary(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="edit-row single">
                                            <div>
                                                <label>Eligibility</label>
                                                <input type="text" value={editEligibility}
                                                    onChange={(e) => setEditEligibility(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="edit-row single">
                                            <div>
                                                <label>Description</label>
                                                <textarea value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    rows="4"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <button className="save-btn" onClick={() => handleUpdateJob(job._id)}>
                                            <FaSave /> Save Changes
                                        </button>
                                        <button className="cancel-btn" onClick={handleCancelEdit}>
                                            <FaTimes /> Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </>
            ) : (
                <div className="no-jobs">
                    <div className="icon"><FaBriefcase /></div>
                    <h3>No Jobs Posted Yet</h3>
                    <p>Start posting jobs to find the best candidates!</p>
                    <Link to="/job/post" className="post-btn">
                        <FaPlus /> Post Your First Job
                    </Link>
                </div>
            )}
        </div>
        </AdminLayout>
    );
};

export default MyJobs;