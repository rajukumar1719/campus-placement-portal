import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { FaBell, FaTrash, FaPaperPlane, FaLock } from "react-icons/fa";
import "./SendNotification.css";

const SendNotification = () => {
    const { isAuthorized, user } = useContext(Context);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message) {
            toast.error("Please fill all fields");
            return;
        }
        setSending(true);
        try {
            const res = await API.post("/notifications", { title, message });
            toast.success(res.data.message);
            setTitle("");
            setMessage("");
            fetchNotifications();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send");
        }
        setSending(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this notification?")) return;
        try {
            const res = await API.delete(`/notifications/${id}`);
            toast.success(res.data.message);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            toast.error("Failed to delete");
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

    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="sn-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="sn-page">

                {/* ── Header ── */}
                <div className="sn-header">
                    <h2>Notifications</h2>
                    <p>Send announcements to all students</p>
                </div>

                {/* ── Send Form ── */}
                <div className="sn-card">
                    <div className="sn-card-title">
                        <FaBell />
                        <h3>Send New Notification</h3>
                    </div>

                    <form onSubmit={handleSend}>
                        <div className="sn-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Notification title"
                                required
                            />
                        </div>

                        <div className="sn-group">
                            <label>Message *</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your message to students..."
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="sn-send-btn"
                            disabled={sending}
                        >
                            <FaPaperPlane />
                            {sending ? "Sending..." : "Send Notification"}
                        </button>
                    </form>
                </div>

                {/* ── Notifications List ── */}
                <div className="sn-list-section">
                    <h3 className="sn-list-title">
                        Previous Notifications
                        {notifications.length > 0 && (
                            <span>{notifications.length}</span>
                        )}
                    </h3>

                    {loading ? (
                        <div className="sn-loading">
                            <div className="sn-spinner"></div>
                            <p>Loading...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="sn-list">
                            {notifications.map((notif) => (
                                <div className="sn-item" key={notif._id}>
                                    <div className="sn-item-icon">
                                        <FaBell />
                                    </div>
                                    <div className="sn-item-body">
                                        <h4>{notif.title}</h4>
                                        <p>{notif.message}</p>
                                        <span>{formatDate(notif.createdAt)}</span>
                                    </div>
                                    <button
                                        className="sn-delete"
                                        onClick={() => handleDelete(notif._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="sn-empty">
                            <FaBell />
                            <p>No notifications sent yet</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SendNotification;