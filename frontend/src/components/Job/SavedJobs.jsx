import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FaBookmark, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import "./Jobs.css";
import "./SavedJobs.css";

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const res = await API.get("/jobs/saved/my");
            setJobs(res.data.jobs || []);
        } catch (error) {
            toast.error("Failed to load saved jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleUnsave = async (jobId) => {
        try {
            await API.post(`/jobs/${jobId}/save`);
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
            toast.success("Removed from saved jobs");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="jobs-page">
            <div className="page-header">
                <h2><FaBookmark /> Saved Jobs</h2>
                <p>Jobs you've bookmarked for later</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading saved jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="no-jobs">
                    <div className="icon"><FaBookmark /></div>
                    <h3>No Saved Jobs Yet</h3>
                    <p>Bookmark jobs from the listings page to see them here</p>
                    <Link to="/jobs" className="clear-search-btn">Browse Jobs</Link>
                </div>
            ) : (
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <div className="job-card" key={job._id}>
                            <button
                                className="saved-unsave-btn"
                                onClick={() => handleUnsave(job._id)}
                                title="Remove from saved"
                            >
                                <FaBookmark />
                            </button>

                            <div className="card-header">
                                <h3>{job.jobTitle}</h3>
                            </div>
                            <p className="company">{job.companyName}</p>
                            <div className="tags">
                                <span><FaMapMarkerAlt /> {job.location}</span>
                                <span><FaBriefcase /> {job.jobType}</span>
                                <span className="salary-tag">💰 {job.salary}</span>
                            </div>
                            <Link to={`/job/${job._id}`} className="view-btn">
                                View Details →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
