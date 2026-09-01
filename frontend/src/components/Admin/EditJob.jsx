import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import "./EditJob.css";

const EditJob = () => {
    const { id } = useParams();
    const { isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: "",
        jobTitle: "",
        description: "",
        jobType: "Full Time",
        location: "",
        salary: "",
        eligibility: "",
        minCGPA: "",
        deadline: "",
        applyLink: "",
        status: "active",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await API.get(`/jobs/${id}`);
                const job = res.data.job;
                setFormData({
                    companyName: job.companyName || "",
                    jobTitle: job.jobTitle || "",
                    description: job.description || "",
                    jobType: job.jobType || "Full Time",
                    location: job.location || "",
                    salary: job.salary || "",
                    eligibility: job.eligibility || "",
                    minCGPA: job.minCGPA || "",
                    deadline: job.deadline ? job.deadline.split("T")[0] : "",
                    applyLink: job.applyLink || "",
                    status: job.status || "active",
                });
            } catch (error) {
                console.log("Error:", error);
                toast.error("Job not found");
                navigate("/admin/jobs");
            } finally {
                setLoading(false);
            }
        };
        if (isAuthorized && user?.role === "admin") {
            fetchJob();
        }
    }, [id, navigate, isAuthorized, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const res = await API.put(`/jobs/${id}`, formData);
            toast.success(res.data.message);
            navigate("/admin/jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
        }
        setUpdating(false);
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user && user.role !== "admin") {
        return (
            <AdminLayout>
                <div className="access-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                </div>
            </AdminLayout>
        );
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading job details...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="edit-job">
                <Link to="/admin/jobs" className="back-btn">
                    <FaArrowLeft /> Back to Jobs
                </Link>

                <div className="page-header">
                    <h2>Edit Job</h2>
                    <p>Update the job listing details</p>
                </div>

                <form className="job-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Job Title *</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Salary/Package *</label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="jobType" value={formData.jobType} onChange={handleChange}>
                                <option value="Full Time">Full Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Eligibility</label>
                            <input
                                type="text"
                                name="eligibility"
                                value={formData.eligibility}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Min CGPA</label>
                            <input
                                type="number"
                                name="minCGPA"
                                value={formData.minCGPA}
                                onChange={handleChange}
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={updating}>
                        {updating ? "Updating..." : "Update Job"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditJob;