import React, { useContext, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaArrowLeft, FaLock, FaBuilding, FaBriefcase,
    FaMapMarkerAlt, FaMoneyBillWave, FaGraduationCap,
    FaCalendarAlt, FaLink, FaFileAlt,
} from "react-icons/fa";
import "./CreateJob.css";

const CreateJob = () => {
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
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/jobs", {
                ...formData,
                minCGPA: formData.minCGPA || 0,
            });
            toast.success(res.data.message);
            navigate("/admin/jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create job");
        }
        setLoading(false);
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="cj-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                    <p>Only administrators can create jobs.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="cj-page">

                {/* ── Back ── */}
                <Link to="/admin/jobs" className="cj-back">
                    <FaArrowLeft /> Back to Jobs
                </Link>

                {/* ── Header ── */}
                <div className="cj-header">
                    <h2>Post New Job</h2>
                    <p>Fill in the details to create a new job listing</p>
                </div>

                {/* ── Form ── */}
                <div className="cj-card">
                    <form onSubmit={handleSubmit}>

                        {/* Section: Company */}
                        <div className="cj-section-label">
                            <FaBuilding /> Company Details
                        </div>

                        <div className="cj-row">
                            <div className="cj-group">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Google, Infosys"
                                    required
                                />
                            </div>
                            <div className="cj-group">
                                <label>Job Title *</label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section: Job Details */}
                        <div className="cj-section-label">
                            <FaBriefcase /> Job Details
                        </div>

                        <div className="cj-row">
                            <div className="cj-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Bangalore, Remote"
                                    required
                                />
                            </div>
                            <div className="cj-group">
                                <label>Salary / Package *</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 6 LPA or 25,000/month"
                                    required
                                />
                            </div>
                        </div>

                        <div className="cj-row">
                            <div className="cj-group">
                                <label>Job Type *</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div className="cj-group">
                                <label>Application Deadline *</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section: Eligibility */}
                        <div className="cj-section-label">
                            <FaGraduationCap /> Eligibility
                        </div>

                        <div className="cj-row">
                            <div className="cj-group">
                                <label>Eligible Branches *</label>
                                <input
                                    type="text"
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    placeholder="e.g. CSE, IT, ECE, All Branches"
                                    required
                                />
                            </div>
                            <div className="cj-group">
                                <label>Minimum CGPA</label>
                                <input
                                    type="number"
                                    name="minCGPA"
                                    value={formData.minCGPA}
                                    onChange={handleChange}
                                    placeholder="e.g. 6.5 (leave blank = no requirement)"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                />
                            </div>
                        </div>

                        {/* Section: Description */}
                        <div className="cj-section-label">
                            <FaFileAlt /> Description
                        </div>

                        <div className="cj-group">
                            <label>Job Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write detailed job description, responsibilities, requirements..."
                                rows="6"
                                required
                            ></textarea>
                        </div>

                        {/* Optional
                        <div className="cj-section-label">
                            <FaLink /> Optional
                        </div>

                        <div className="cj-group">
                            <label>External Apply Link</label>
                            <input
                                type="text"
                                name="applyLink"
                                value={formData.applyLink}
                                onChange={handleChange}
                                placeholder="https://company.com/apply"
                            />
                        </div> */}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="cj-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="cj-btn-spinner"></div>
                                    Creating Job...
                                </>
                            ) : (
                                "Post Job"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateJob;