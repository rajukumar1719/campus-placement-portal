import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import { FaLock } from "react-icons/fa";
import "./PostJob.css";
import AdminLayout from "../Admin/AdminLayout";

const PostJob = () => {
    const { isAuthorized, user } = useContext(Context);
    const navigateTo = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [description, setDescription] = useState("");
    const [jobType, setJobType] = useState("Full Time");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [minCGPA, setMinCGPA] = useState("");
    const [deadline, setDeadline] = useState("");
    const [applyLink, setApplyLink] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/jobs", {
                companyName,
                jobTitle,
                description,
                jobType,
                location,
                salary,
                eligibility,
                minCGPA: minCGPA || 0,
                deadline,
                applyLink,
            });

            toast.success(response.data.message);
            navigateTo("/job/me");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        }
        setLoading(false);
    };

    // Not logged in
    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    // Not admin
    if (user && user.role !== "admin") {
        return (
            <div className="post-job-page">
                <div className="not-authorized">
                    <div className="icon"><FaLock /></div>
                    <h3>Access Denied</h3>
                    <p>Only Admin can post jobs.</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
        <div className="post-job-page">
            <div className="page-header">
                <h2>Post New Job</h2>
                <p>Fill in the details to create a new job listing</p>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    {/* Company & Job Title */}
                    <div className="two-col">
                        <div className="input-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                placeholder="Enter company name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Job Title</label>
                            <input
                                type="text"
                                placeholder="Enter job title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Location & Salary */}
                    <div className="two-col">
                        <div className="input-group">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Enter location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Salary/Package</label>
                            <input
                                type="text"
                                placeholder="e.g. 6 LPA or 25000/month"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Job Type & Min CGPA */}
                    <div className="two-col">
                        <div className="input-group">
                            <label>Job Type</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                                <option value="Part Time">Part Time</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Min CGPA (0 = no requirement)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 6.5"
                                value={minCGPA}
                                onChange={(e) => setMinCGPA(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Eligibility & Deadline */}
                    <div className="two-col">
                        <div className="input-group">
                            <label>Eligibility (Branches)</label>
                            <input
                                type="text"
                                placeholder="e.g. CSE, IT, ECE"
                                value={eligibility}
                                onChange={(e) => setEligibility(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Application Deadline</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Apply Link */}
                    <div className="input-group">
                        <label>Apply Link (Optional)</label>
                        <input
                            type="text"
                            placeholder="External apply link (optional)"
                            value={applyLink}
                            onChange={(e) => setApplyLink(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="input-group">
                        <label>Job Description</label>
                        <textarea
                            placeholder="Write detailed job description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Posting..." : "Post Job"}
                    </button>
                </form>
            </div>
        </div>
        </AdminLayout>
    );
};

export default PostJob;