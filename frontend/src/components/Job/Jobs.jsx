import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import {
    FaBriefcase, FaSearch, FaFilter, FaTimes,
    FaMapMarkerAlt, FaGraduationCap, FaChevronLeft,
    FaChevronRight, FaSortAmountDown, FaBookmark, FaRegBookmark,
} from "react-icons/fa";
import "./Jobs.css";

const Jobs = () => {
    const { user } = useContext(Context);
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // ✅ Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [jobType, setJobType] = useState("");
    const [location, setLocation] = useState("");
    const [branch, setBranch] = useState("");
    const [minCGPA, setMinCGPA] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // ✅ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    // ✅ Filter Options
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        jobTypes: [],
        branches: []
    });

    // ✅ Fetch jobs from backend with filters
    useEffect(() => {
        fetchJobs();
    }, [currentPage, sortBy]);

    // ✅ NEW FEATURE: Fetch which jobs the student has saved
    useEffect(() => {
        const fetchSaved = async () => {
            if (!user || user.role !== "student") return;
            try {
                const res = await API.get("/jobs/saved/my");
                setSavedJobIds((res.data.jobs || []).map((j) => j._id));
            } catch (error) {
                // silent fail - saved jobs are non-critical
            }
        };
        fetchSaved();
    }, [user]);

    // ✅ NEW FEATURE: Toggle save/unsave a job
    const handleToggleSave = async (jobId) => {
        if (!user) {
            toast.error("Please login to save jobs");
            return;
        }
        try {
            const res = await API.post(`/jobs/${jobId}/save`);
            if (res.data.saved) {
                setSavedJobIds((prev) => [...prev, jobId]);
                toast.success("Job saved!");
            } else {
                setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
                toast.success("Removed from saved jobs");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            let url = `/jobs?page=${currentPage}&limit=12&sortBy=${sortBy}`;

            if (searchQuery) url += `&search=${searchQuery}`;
            if (jobType) url += `&jobType=${jobType}`;
            if (location) url += `&location=${location}`;
            if (branch) url += `&branch=${branch}`;
            if (minCGPA) url += `&minCGPA=${minCGPA}`;

            const response = await API.get(url);

            setJobs(response.data.jobs);
            setTotalPages(response.data.totalPages || 1);
            setTotalJobs(response.data.total || 0);

            // Set filter options
            if (response.data.filters) {
                setFilterOptions(response.data.filters);
            }

        } catch (error) {
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Search Submit
    const handleSearch = (e) => {
        e?.preventDefault();
        setCurrentPage(1);
        fetchJobs();
    };

    // ✅ Apply Filters
    const applyFilters = () => {
        setCurrentPage(1);
        fetchJobs();
        setShowFilters(false);
    };

    // ✅ Clear All Filters
    const clearFilters = () => {
        setSearchQuery("");
        setJobType("");
        setLocation("");
        setBranch("");
        setMinCGPA("");
        setSortBy("newest");
        setCurrentPage(1);
        setTimeout(() => fetchJobs(), 100);
        setShowFilters(false);
    };

    // ✅ Check if any filter active
    const hasActiveFilters = searchQuery || jobType || location || branch || minCGPA;

    // Date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
    };

    // Days remaining
    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="jobs-page">

            {/* ===== Page Header ===== */}
            <div className="page-header">
                <h2>All Available Jobs</h2>
                <p>Explore opportunities and find the perfect match for you</p>
            </div>

            {/* ===== Search Bar ===== */}
            <form className="search-bar" onSubmit={handleSearch}>
                <div className="search-input-wrap">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={() => {
                                setSearchQuery("");
                                setTimeout(() => {
                                    setCurrentPage(1);
                                    fetchJobs();
                                }, 100);
                            }}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
                <button type="submit" className="search-btn">
                    Search
                </button>
                <button
                    type="button"
                    className={`filter-toggle-btn ${hasActiveFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FaFilter />
                    Filters
                    {hasActiveFilters && <span className="filter-dot"></span>}
                </button>
            </form>

            {/* ===== Filter Panel ===== */}
            {showFilters && (
                <div className="filter-panel">
                    <div className="filter-header">
                        <h3><FaFilter /> Filters</h3>
                        <button className="close-filter" onClick={() => setShowFilters(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="filter-grid">
                        {/* Job Type */}
                        <div className="filter-group">
                            <label><FaBriefcase /> Job Type</label>
                            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                                <option value="">All Types</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="filter-group">
                            <label><FaMapMarkerAlt /> Location</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                <option value="">All Locations</option>
                                {filterOptions.locations.map((loc, i) => (
                                    <option key={i} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Branch */}
                        <div className="filter-group">
                            <label><FaGraduationCap /> Branch</label>
                            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                                <option value="">All Branches</option>
                                {filterOptions.branches.map((b, i) => (
                                    <option key={i} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        {/* CGPA */}
                        <div className="filter-group">
                            <label><FaGraduationCap /> Your CGPA</label>
                            <input
                                type="number"
                                placeholder="e.g. 7.5"
                                value={minCGPA}
                                onChange={(e) => setMinCGPA(e.target.value)}
                                step="0.1"
                                min="0"
                                max="10"
                            />
                        </div>

                        {/* Sort */}
                        <div className="filter-group">
                            <label><FaSortAmountDown /> Sort By</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="deadline">Deadline Soon</option>
                                <option value="cgpa_low">CGPA: Low to High</option>
                                <option value="cgpa_high">CGPA: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="apply-filter-btn" onClick={applyFilters}>
                            Apply Filters
                        </button>
                        <button className="clear-filter-btn" onClick={clearFilters}>
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* ===== Active Filters Tags ===== */}
            {hasActiveFilters && (
                <div className="active-filters">
                    {searchQuery && (
                        <span className="filter-tag">
                            🔍 {searchQuery}
                            <button onClick={() => { setSearchQuery(""); fetchJobs(); }}>
                                <FaTimes />
                            </button>
                        </span>
                    )}
                    {jobType && (
                        <span className="filter-tag">
                            💼 {jobType}
                            <button onClick={() => { setJobType(""); fetchJobs(); }}>
                                <FaTimes />
                            </button>
                        </span>
                    )}
                    {location && (
                        <span className="filter-tag">
                            📍 {location}
                            <button onClick={() => { setLocation(""); fetchJobs(); }}>
                                <FaTimes />
                            </button>
                        </span>
                    )}
                    {branch && (
                        <span className="filter-tag">
                            🎓 {branch}
                            <button onClick={() => { setBranch(""); fetchJobs(); }}>
                                <FaTimes />
                            </button>
                        </span>
                    )}
                    {minCGPA && (
                        <span className="filter-tag">
                            📊 CGPA ≤ {minCGPA}
                            <button onClick={() => { setMinCGPA(""); fetchJobs(); }}>
                                <FaTimes />
                            </button>
                        </span>
                    )}
                    <button className="clear-all-btn" onClick={clearFilters}>
                        Clear All
                    </button>
                </div>
            )}

            {/* ===== Jobs Count ===== */}
            {!loading && (
                <p className="jobs-count">
                    Showing <span>{jobs.length}</span> of <span>{totalJobs}</span> jobs
                </p>
            )}

            {/* ===== Loading ===== */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading jobs...</p>
                </div>
            ) : (
                <>
                    {/* ===== Jobs Grid ===== */}
                    <div className="jobs-grid">
                        {jobs.length > 0 ? (
                            jobs.map((job) => {
                                const daysLeft = getDaysRemaining(job.deadline);
                                return (
                                    <div className="job-card" key={job._id} style={{ position: "relative" }}>
                                        {/* NEW FEATURE: Save/Bookmark button */}
                                        {user && user.role === "student" && (
                                            <button
                                                className="saved-unsave-btn"
                                                style={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    background: savedJobIds.includes(job._id) ? "#6C5CE7" : "#f1f1f5",
                                                    color: savedJobIds.includes(job._id) ? "#fff" : "#555",
                                                    border: "none",
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleToggleSave(job._id)}
                                                title={savedJobIds.includes(job._id) ? "Remove from saved" : "Save job"}
                                            >
                                                {savedJobIds.includes(job._id) ? <FaBookmark /> : <FaRegBookmark />}
                                            </button>
                                        )}

                                        {/* Card Header */}
                                        <div className="card-header">
                                            <h3>{job.jobTitle}</h3>
                                            <span className="posted-date">
                                                {formatDate(job.createdAt)}
                                            </span>
                                        </div>

                                        {/* Company */}
                                        <p className="company">{job.companyName}</p>

                                        {/* Tags */}
                                        <div className="tags">
                                            <span>📍 {job.location}</span>
                                            <span>💼 {job.jobType}</span>
                                            <span className="salary-tag">💰 {job.salary}</span>
                                        </div>

                                        {/* Eligibility */}
                                        <div className="eligibility">
                                            🎓 {job.eligibility}
                                        </div>

                                        {/* Min CGPA */}
                                        {job.minCGPA > 0 && (
                                            <p className="cgpa-info">
                                                Min CGPA: <strong>{job.minCGPA}</strong>
                                            </p>
                                        )}

                                        {/* Deadline */}
                                        <div className={`deadline-info ${daysLeft <= 7 ? 'soon' : ''} ${daysLeft <= 3 ? 'urgent' : ''}`}>
                                            📅 Deadline: {formatDate(job.deadline)}
                                            {daysLeft <= 7 && daysLeft > 0 && (
                                                <span className="days-left">
                                                    {daysLeft} days left!
                                                </span>
                                            )}
                                        </div>

                                        {/* View Button */}
                                        <Link to={`/job/${job._id}`} className="view-btn">
                                            View Details →
                                        </Link>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-jobs">
                                <div className="icon"><FaBriefcase /></div>
                                <h3>No Jobs Found</h3>
                                <p>Try changing your search or filters</p>
                                {hasActiveFilters && (
                                    <button className="clear-search-btn" onClick={clearFilters}>
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ===== Pagination ===== */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft /> Prev
                            </button>

                            <div className="page-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`page-num ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Jobs;