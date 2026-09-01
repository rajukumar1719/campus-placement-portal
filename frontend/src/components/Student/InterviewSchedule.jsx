import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import API from "../../api/axios";
import {
    FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt,
    FaLink, FaBriefcase, FaBuilding,
} from "react-icons/fa";
import "./InterviewSchedule.css";

const InterviewSchedule = () => {
    const { isAuthorized } = useContext(Context);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await API.get("/interviews/my");
            setInterviews(res.data.interviews || []);
        } catch (error) {
            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric"
        });
    };

    const isUpcoming = (date) => new Date(date) >= new Date();

    if (!isAuthorized) return <Navigate to="/login" />;

    return (
        <div className="interview-schedule">
            <div className="page-header">
                <h2><FaCalendarAlt /> My Interviews</h2>
                <p>View your scheduled interviews</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : interviews.length > 0 ? (
                <div className="int-list">
                    {interviews.map(int => (
                        <div className={`int-card ${int.status} ${isUpcoming(int.interviewDate) ? 'upcoming' : 'past'}`} key={int._id}>
                            <div className="int-card-header">
                                <div>
                                    <h3><FaBriefcase /> {int.job?.jobTitle}</h3>
                                    <p><FaBuilding /> {int.job?.companyName}</p>
                                </div>
                                <span className={`status ${int.status}`}>{int.status}</span>
                            </div>

                            <div className="int-card-body">
                                <div className="int-info-grid">
                                    <div className="int-info">
                                        <FaCalendarAlt />
                                        <div>
                                            <span>Date</span>
                                            <strong>{formatDate(int.interviewDate)}</strong>
                                        </div>
                                    </div>
                                    <div className="int-info">
                                        <FaClock />
                                        <div>
                                            <span>Time</span>
                                            <strong>{int.interviewTime}</strong>
                                        </div>
                                    </div>
                                    <div className="int-info">
                                        <FaVideo />
                                        <div>
                                            <span>Type</span>
                                            <strong>{int.interviewType}</strong>
                                        </div>
                                    </div>
                                    <div className="int-info">
                                        <FaCalendarAlt />
                                        <div>
                                            <span>Round</span>
                                            <strong>{int.round}</strong>
                                        </div>
                                    </div>
                                </div>

                                {int.venue && (
                                    <div className="int-venue">
                                        <FaMapMarkerAlt /> <strong>Venue:</strong> {int.venue}
                                    </div>
                                )}

                                {int.meetingLink && (
                                    <a href={int.meetingLink} target="_blank" rel="noreferrer" className="join-btn">
                                        <FaLink /> Join Interview
                                    </a>
                                )}

                                {int.instructions && (
                                    <div className="int-instructions">
                                        📝 <strong>Instructions:</strong> {int.instructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-interviews">
                    <FaCalendarAlt />
                    <h3>No Interviews Scheduled</h3>
                    <p>Your interviews will appear here once scheduled.</p>
                </div>
            )}
        </div>
    );
};

export default InterviewSchedule;