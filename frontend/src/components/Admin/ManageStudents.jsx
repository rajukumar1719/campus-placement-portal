import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
    FaEnvelope, FaPhone, FaGraduationCap,
    FaTrash, FaSearch, FaLock, FaUsers, FaFileDownload,
} from "react-icons/fa";
import "./ManageStudents.css";

const ManageStudents = () => {
    const { isAuthorized, user } = useContext(Context);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await API.get("/admin/students");
            setStudents(res.data.students);
        } catch (error) {
            console.log("Error:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/admin/students?search=${search}`);
            setStudents(res.data.students);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW FEATURE: Export students list as CSV
    const exportToCSV = () => {
        if (students.length === 0) {
            toast.error("No students to export");
            return;
        }

        const headers = ["Name", "Email", "Phone", "Branch", "CGPA", "Semester", "Batch"];

        const escapeCSV = (value) => {
            const str = String(value ?? "");
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = students.map((s) => [
            s.name, s.email, s.phone, s.branch, s.cgpa, s.semester, s.batch
        ].map(escapeCSV).join(","));

        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `students_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Students list exported!");
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm("Delete this student? All applications will also be deleted.")) return;
        try {
            const res = await API.delete(`/admin/students/${studentId}`);
            toast.success(res.data.message);
            setStudents((prev) => prev.filter((s) => s._id !== studentId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (user?.role !== "admin") {
        return (
            <AdminLayout>
                <div className="ms-denied">
                    <FaLock />
                    <h2>Access Denied</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="ms-page">

                {/* ── Header ── */}
                <div className="ms-header">
                    <div>
                        <h2>Manage Students</h2>
                        <p>View and manage registered students</p>
                    </div>

                    {/* NEW FEATURE: Export CSV button */}
                    <button
                        onClick={exportToCSV}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#6C5CE7",
                            color: "#fff",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 500,
                            marginRight: "12px",
                        }}
                    >
                        <FaFileDownload /> Export CSV
                    </button>

                    {/* Search */}
                    <div className="ms-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>

                {loading ? (
                    <div className="ms-loading">
                        <div className="ms-spinner"></div>
                        <p>Loading students...</p>
                    </div>
                ) : students.length > 0 ? (
                    <>
                        <p className="ms-count">
                            Total: <span>{students.length}</span> students
                        </p>

                        <div className="ms-list">
                            {students.map((student) => (
                                <div className="ms-card" key={student._id}>

                                    {/* Left */}
                                    <div className="ms-card-left">
                                        <div className="ms-avatar">
                                            {student.name?.charAt(0).toUpperCase() || "S"}
                                        </div>
                                        <div className="ms-info">
                                            <div className="ms-name-row">
                                                <h3>{student.name}</h3>
                                                <span className={`ms-status ${student.profileComplete ? "complete" : "incomplete"}`}>
                                                    {student.profileComplete ? "✓ Complete" : "⚠ Incomplete"}
                                                </span>
                                            </div>

                                            <div className="ms-meta">
                                                <span>
                                                    <FaEnvelope /> {student.email}
                                                </span>
                                                <span>
                                                    <FaPhone /> {student.phone || "N/A"}
                                                </span>
                                                <span>
                                                    <FaGraduationCap /> {student.branch || "N/A"}
                                                </span>
                                                <span>CGPA: {student.cgpa || "N/A"}</span>
                                                <span>Batch: {student.batch || "N/A"}</span>
                                                <span>Joined: {formatDate(student.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete */}
                                    <button
                                        className="ms-delete"
                                        onClick={() => handleDelete(student._id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="ms-empty">
                        <FaUsers />
                        <h3>No Students Found</h3>
                        <p>No students registered yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageStudents;