import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt,
    FaLink, FaPlus, FaTrash, FaTimes, FaCheck,
    FaUser, FaBriefcase, FaLock,
} from "react-icons/fa";
import "./InterviewManage.css";

const InterviewManage = () => {
    const { isAuthorized, user } = useContext(Context);
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [scheduling, setScheduling] = useState(false);

    const [formData, setFormData] = useState({
        applicationId: "",
        interviewDate: "",
        interviewTime: "",
        interviewType: "Online",
        venue: "",
        meetingLink: "",
        round: "Round 1",
        instructions: ""
    });

    useEffect(() => {
        if (isAuthorized && user?.role === "admin") {
            fetchData();
        }
    }, [isAuthorized, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [intRes, appRes] = await Promise.all([
                API.get("/interviews"),
                API.get("/interviews/shortlisted")
            ]);
            setInterviews(intRes.data.interviews || []);
            setApplications(appRes.data.applications || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!formData.applicationId || !formData.interviewDate || !formData.interviewTime) {
            toast.error("Please fill required fields");
            return;
        }

        setScheduling(true);
        try {
            const res = await API.post("/interviews", formData);
            toast.success(res.data.message);
            setShowForm(false);
            setFormData({
                applicationId: "", interviewDate: "", interviewTime: "",
                interviewType: "Online", venue: "", meetingLink: "",
                round: "Round 1", instructions: ""
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to schedule");
        }
        setScheduling(false);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await API.put(`/interviews/${id}`, { status });
            toast.success(res.data.message);
            fetchData();
        } catch (error) {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this interview?")) return;
        try {
            await API.delete(`/interviews/${id}`);
            toast.success("Interview deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    if (!isAuthorized) return <Navigate to="/login" />;
    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="access-denied"><FaLock /><h2>Access Denied</h2></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="interview-manage">
                <div className="page-header">
                    <div>
                        <h2>Interview Schedule</h2>
                        <p>Schedule and manage student interviews</p>
                    </div>
                    <button className="schedule-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? <><FaTimes /> Close</> : <><FaPlus /> Schedule Interview</>}
                    </button>
                </div>

                {/* ===== Schedule Form ===== */}
                {showForm && (
                    <div className="schedule-form">
                        <h3><FaCalendarAlt /> Schedule New Interview</h3>
                        <form onSubmit={handleSchedule}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Select Application *</label>
                                    <select name="applicationId" value={formData.applicationId} onChange={handleChange} required>
                                        <option value="">-- Select Student --</option>
                                        {applications.map(app => (
                                            <option key={app._id} value={app._id} disabled={app.isScheduled}>
                                                {app.student?.name} - {app.job?.companyName} ({app.job?.jobTitle})
                                                {app.isScheduled ? ' ✅ Scheduled' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Round</label>
                                    <select name="round" value={formData.round} onChange={handleChange}>
                                        <option value="Round 1">Round 1</option>
                                        <option value="Round 2">Round 2</option>
                                        <option value="Round 3">Round 3</option>
                                        <option value="HR Round">HR Round</option>
                                        <option value="Technical Round">Technical Round</option>
                                        <option value="Final Round">Final Round</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label>Time *</label>
                                    <input type="time" name="interviewTime" value={formData.interviewTime} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label>Interview Type</label>
                                    <select name="interviewType" value={formData.interviewType} onChange={handleChange}>
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Telephonic">Telephonic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{formData.interviewType === 'Online' ? 'Meeting Link' : 'Venue'}</label>
                                    {formData.interviewType === 'Online' ? (
                                        <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..." />
                                    ) : (
                                        <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Room 101, Building A" />
                                    )}
                                </div>
                            </div>

                            <div className="form-group full">
                                <label>Instructions</label>
                                <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="3" placeholder="Bring your ID card, laptop, etc." />
                            </div>

                            <button type="submit" className="submit-btn" disabled={scheduling}>
                                {scheduling ? "Scheduling..." : "Schedule Interview"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ===== Interviews List ===== */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : interviews.length > 0 ? (
                    <>
                        <p className="count">Total <span>{interviews.length}</span> interviews</p>
                        <div className="interviews-list">
                            {interviews.map(interview => (
                                <div className={`interview-card ${interview.status}`} key={interview._id}>
                                    <div className="int-header">
                                        <div>
                                            <h3><FaUser /> {interview.student?.name}</h3>
                                            <p><FaBriefcase /> {interview.job?.companyName} - {interview.job?.jobTitle}</p>
                                        </div>
                                        <span className={`int-status ${interview.status}`}>
                                            {interview.status}
                                        </span>
                                    </div>

                                    <div className="int-details">
                                        <span><FaCalendarAlt /> {formatDate(interview.interviewDate)}</span>
                                        <span><FaClock /> {interview.interviewTime}</span>
                                        <span><FaVideo /> {interview.interviewType}</span>
                                        <span>🔄 {interview.round}</span>
                                        {interview.venue && <span><FaMapMarkerAlt /> {interview.venue}</span>}
                                        {interview.meetingLink && (
                                            <a href={interview.meetingLink} target="_blank" rel="noreferrer">
                                                <FaLink /> Join Link
                                            </a>
                                        )}
                                    </div>

                                    {interview.instructions && (
                                        <div className="int-instructions">
                                            📝 {interview.instructions}
                                        </div>
                                    )}

                                    <div className="int-actions">
                                        {interview.status === 'scheduled' && (
                                            <>
                                                <button className="complete-btn" onClick={() => handleStatusUpdate(interview._id, 'completed')}>
                                                    <FaCheck /> Complete
                                                </button>
                                                <button className="cancel-btn" onClick={() => handleStatusUpdate(interview._id, 'cancelled')}>
                                                    <FaTimes /> Cancel
                                                </button>
                                            </>
                                        )}
                                        <button className="delete-btn" onClick={() => handleDelete(interview._id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-data">
                        <FaCalendarAlt />
                        <h3>No Interviews Scheduled</h3>
                        <p>Schedule interviews for shortlisted students</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default InterviewManage;