import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import { Context } from "../../context/AuthContext";
import { FaBell, FaCalendarAlt } from "react-icons/fa";
import "./Notifications.css";

const Notifications = () => {
    const { isAuthorized } = useContext(Context);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data.notifications);
        } catch (error) {
            console.log("Error:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    return (
        <div className="notifications-page">
            <div className="page-header">
                <h1><FaBell /> Notifications</h1>
                <p>Stay updated with latest announcements</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading notifications...</p>
                </div>
            ) : notifications.length > 0 ? (
                <div className="notifications-list">
                    {notifications.map((notif) => (
                        <div className="notification-card" key={notif._id}>
                            <div className="notif-icon">
                                <FaBell />
                            </div>
                            <div className="notif-content">
                                <h3>{notif.title}</h3>
                                <p>{notif.message}</p>
                                <span className="notif-date">
                                    <FaCalendarAlt /> {formatDate(notif.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-notifications">
                    <FaBell />
                    <h3>No Notifications</h3>
                    <p>You're all caught up! Check back later for updates.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;