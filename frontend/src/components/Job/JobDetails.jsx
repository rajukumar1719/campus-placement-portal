import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Context } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
    FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave,
    FaBriefcase, FaCalendarAlt, FaPaperPlane,
    FaGraduationCap, FaClock, FaBuilding, FaCheckCircle,
} from "react-icons/fa";
import "./JobDetails.css";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const { isAuthorized, user } = useContext(Context);
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await API.get(`/jobs/${id}`);
                setJob(response.data.job);
            } catch (error) {
                setJob(null);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleApply = async () => {
        setApplying(true);
        try {
            const response = await API.post("/applications", { jobId: id });
            toast.success(response.data.message);
            navigateTo("/applications/me");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        }
        setApplying(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short"
        })} ${date.getFullYear()}`;
    };

    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffDays = Math.ceil(
            (deadlineDate - today) / (1000 * 60 * 60 * 24)
        );
        return diffDays;
    };

    const isExpired = (deadline) => new Date(deadline) < new Date();

    if (loading) {
        return (
            <div className="jd-page">
                <div className="jd-container">
                    <div className="jd-loading">
                        <div className="jd-spinner"></div>
                        <p>Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="jd-page">
                <div className="jd-container">
                    <button
                        className="jd-back"
                        onClick={() => navigateTo("/jobs")}
                    >
                        <FaArrowLeft /> Back to Jobs
                    </button>
                    <div className="jd-not-found">
                        <span>🔍</span>
                        <h3>Job Not Found</h3>
                        <p>This job may have been removed or doesn't exist.</p>
                        <Link to="/jobs" className="jd-back-link">
                            Browse All Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const daysLeft = getDaysLeft(job.deadline);
    const expired = isExpired(job.deadline);

    return (
        <div className="jd-page">
            <div className="jd-container">

                {/* Back */}
                <button
                    className="jd-back"
                    onClick={() => navigateTo("/jobs")}
                >
                    <FaArrowLeft /> Back to Jobs
                </button>

                <div className="jd-wrapper">

                    {/* ===== LEFT ===== */}
                    <div className="jd-left">

                        {/* Header */}
                        <div className="jd-card jd-header">
                            <div className="jd-logo">
                                {job.companyName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="jd-header-body">
                                <h1>{job.jobTitle}</h1>
                                <p className="jd-company">
                                    <FaBuilding /> {job.companyName}
                                </p>
                                <div className="jd-chips">
                                    <span className="jd-chip">
                                        <FaMapMarkerAlt /> {job.location}
                                    </span>
                                    <span className="jd-chip">
                                        <FaBriefcase /> {job.jobType}
                                    </span>
                                    <span className="jd-chip green">
                                        <FaMoneyBillWave /> {job.salary}
                                    </span>
                                    {job.minCGPA > 0 && (
                                        <span className="jd-chip blue">
                                            <FaGraduationCap /> CGPA {job.minCGPA}+
                                        </span>
                                    )}
                                    <span className={`jd-chip ${expired ? "red" : daysLeft <= 7 ? "orange" : "gray"}`}>
                                        <FaClock />
                                        {expired
                                            ? "Expired"
                                            : daysLeft === 0
                                                ? "Last day!"
                                                : `${daysLeft} days left`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="jd-card">
                            <div className="jd-section-title">
                                <div className="jd-title-bar"></div>
                                <h2>Job Description</h2>
                            </div>
                            <p className="jd-text">{job.description}</p>
                        </div>

                        {/* Eligibility */}
                        <div className="jd-card">
                            <div className="jd-section-title">
                                <div className="jd-title-bar"></div>
                                <h2>Eligibility Criteria</h2>
                            </div>
                            <p className="jd-text">{job.eligibility}</p>
                        </div>

                    </div>

                    {/* ===== RIGHT ===== */}
                    <div className="jd-right">

                        {/* Apply Card */}
                        <div className="jd-card jd-apply-card">

                            {/* Deadline Box */}
                            <div className={`jd-deadline-box ${expired ? "expired" : daysLeft <= 7 ? "soon" : ""}`}>
                                <FaCalendarAlt />
                                <div>
                                    <span>Application Deadline</span>
                                    <strong>{formatDate(job.deadline)}</strong>
                                    {expired && <small>Applications closed</small>}
                                    {!expired && daysLeft <= 7 && (
                                        <small>Only {daysLeft} day{daysLeft !== 1 ? "s" : ""} left!</small>
                                    )}
                                </div>
                            </div>

                            {/* Apply Button - Student */}
                            {isAuthorized && user?.role === "student" && (
                                <>
                                    <button
                                        className={`jd-apply-btn ${expired ? "disabled" : ""}`}
                                        onClick={handleApply}
                                        disabled={applying || expired}
                                    >
                                        {applying ? (
                                            <>
                                                <div className="jd-btn-spinner"></div>
                                                Applying...
                                            </>
                                        ) : expired ? (
                                            "Applications Closed"
                                        ) : (
                                            <>
                                                <FaPaperPlane /> Apply Now
                                            </>
                                        )}
                                    </button>
                                    {!expired && (
                                        <p className="jd-apply-note">
                                            <FaCheckCircle />
                                            Your profile will be shared
                                        </p>
                                    )}
                                </>
                            )}

                            {/* Admin View */}
                            {isAuthorized && user?.role === "admin" && (
                                <div className="jd-admin-note">
                                    👮 Admin View — Students can apply
                                </div>
                            )}

                            {/* Not Logged In */}
                            {!isAuthorized && (
                                <>
                                    <Link to="/login" className="jd-apply-btn">
                                        <FaPaperPlane /> Login to Apply
                                    </Link>
                                    <p className="jd-apply-note">
                                        Login as student to apply
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Job Overview */}
                        <div className="jd-card jd-overview">
                            <h3>Job Overview</h3>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon">
                                    <FaBriefcase />
                                </div>
                                <div>
                                    <span>Job Type</span>
                                    <strong>{job.jobType}</strong>
                                </div>
                            </div>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <span>Location</span>
                                    <strong>{job.location}</strong>
                                </div>
                            </div>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon green">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <span>Salary Package</span>
                                    <strong className="green">{job.salary}</strong>
                                </div>
                            </div>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon blue">
                                    <FaGraduationCap />
                                </div>
                                <div>
                                    <span>Min CGPA</span>
                                    <strong>
                                        {job.minCGPA > 0
                                            ? job.minCGPA
                                            : "No requirement"}
                                    </strong>
                                </div>
                            </div>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <span>Posted On</span>
                                    <strong>{formatDate(job.createdAt)}</strong>
                                </div>
                            </div>

                            <div className="jd-ov-row">
                                <div className="jd-ov-icon purple">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <span>Posted By</span>
                                    <strong>{job.postedBy?.name || "Admin"}</strong>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;