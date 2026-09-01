import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AuthContext";
import {
    FaUser, FaEnvelope, FaPhone, FaGraduationCap,
    FaBuilding, FaCalendarAlt, FaMapMarkerAlt,
    FaCode, FaSave, FaCheckCircle, FaExclamationCircle,
    FaUpload, FaFilePdf, FaTrash, FaDownload,
} from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
    const { isAuthorized, user, setUser } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [currentResume, setCurrentResume] = useState(null);

    const [formData, setFormData] = useState({
        name: "", phone: "", dateOfBirth: "",
        gender: "", branch: "", semester: "",
        cgpa: "", batch: "", collegeName: "",
        address: "", skills: "",
        percentage10th: "", percentage12th: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/profile");
            const userData = res.data.user;
            setFormData({
                name: userData.name || "",
                phone: userData.phone || "",
                dateOfBirth: userData.dateOfBirth
                    ? userData.dateOfBirth.split("T")[0] : "",
                gender: userData.gender || "",
                branch: userData.branch || "",
                semester: userData.semester || "",
                cgpa: userData.cgpa || "",
                batch: userData.batch || "",
                collegeName: userData.collegeName || "",
                address: userData.address || "",
                skills: userData.skills || "",
                percentage10th: userData.percentage10th || "",
                percentage12th: userData.percentage12th || "",
            });
            setCurrentResume(userData.resume || null);
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await API.put("/profile", formData);
            toast.success(res.data.message);
            setUser(res.data.user);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
        setUpdating(false);
    };

    // ✅ Resume File Select
    const handleResumeSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // File validation
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files allowed!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB!');
            return;
        }

        setResumeFile(file);
        toast.success(`File selected: ${file.name}`);
    };

    // ✅ Resume Upload
    const handleResumeUpload = async () => {
        if (!resumeFile) {
            toast.error('Please select a PDF file first');
            return;
        }

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('resume', resumeFile);

            const res = await API.post('/upload/resume', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(res.data.message);
            setCurrentResume(res.data.resumeUrl);
            setResumeFile(null);

            // File input reset
            document.getElementById('resumeInput').value = '';

        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        }
        setUploading(false);
    };

    // ✅ Resume Delete
    const handleResumeDelete = async () => {
        const confirm = window.confirm('Delete your resume?');
        if (!confirm) return;

        try {
            await API.delete('/upload/resume');
            toast.success('Resume deleted successfully');
            setCurrentResume(null);
        } catch (error) {
            toast.error('Failed to delete resume');
        }
    };

    // Profile completion check
    const isProfileComplete = () => {
        return (
            formData.name && formData.phone &&
            formData.branch && formData.cgpa &&
            formData.batch && formData.collegeName
        );
    };

    if (!isAuthorized) return <Navigate to="/login" />;

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* ===== Profile Header ===== */}
            <div className="profile-header">
                <div className="header-content">
                    <div className="avatar">
                        {formData.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div className="header-info">
                        <h1>{formData.name || "Student"}</h1>
                        <p><FaEnvelope /> {user?.email}</p>
                        <div className={`profile-status ${isProfileComplete() ? "complete" : "incomplete"}`}>
                            {isProfileComplete() ? (
                                <><FaCheckCircle /> Profile Complete</>
                            ) : (
                                <><FaExclamationCircle /> Complete your profile to apply for jobs</>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Resume Section ===== */}
            <div className="resume-section">
                <h2><FaFilePdf /> Resume</h2>

                {/* Current Resume */}
                {currentResume ? (
                    <div className="resume-uploaded">
                        <div className="resume-info">
                            <div className="resume-icon">
                                <FaFilePdf />
                            </div>
                            <div className="resume-details">
                                <p>Resume Uploaded ✅</p>
                                <span>PDF File</span>
                            </div>
                        </div>
                        <div className="resume-actions">
                            <a
                                href={currentResume}
                                target="_blank"
                                rel="noreferrer"
                                className="resume-view-btn"
                            >
                                <FaDownload /> View/Download
                            </a>
                            <button
                                className="resume-delete-btn"
                                onClick={handleResumeDelete}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="resume-empty">
                        <FaFilePdf />
                        <p>No resume uploaded yet</p>
                    </div>
                )}

                {/* Upload New Resume */}
                <div className="resume-upload">
                    <div className="upload-area">
                        <input
                            type="file"
                            id="resumeInput"
                            accept=".pdf"
                            onChange={handleResumeSelect}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="resumeInput" className="upload-label">
                            <FaUpload />
                            <span>
                                {resumeFile
                                    ? resumeFile.name
                                    : currentResume
                                        ? 'Replace Resume (PDF)'
                                        : 'Select Resume (PDF only, max 5MB)'
                                }
                            </span>
                        </label>
                    </div>

                    {resumeFile && (
                        <button
                            className="upload-btn"
                            onClick={handleResumeUpload}
                            disabled={uploading}
                        >
                            <FaUpload />
                            {uploading ? 'Uploading...' : 'Upload Resume'}
                        </button>
                    )}
                </div>
            </div>

            {/* ===== Profile Form ===== */}
            <form className="profile-form" onSubmit={handleSubmit}>

                {/* Personal Information */}
                <h2>Personal Information</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label><FaUser /> Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaPhone /> Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaCalendarAlt /> Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label><FaUser /> Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Academic Information */}
                <h2>Academic Information</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label><FaGraduationCap /> Branch *</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Branch</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="EE">EE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label><FaCalendarAlt /> Semester</label>
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                        >
                            <option value="">Select Semester</option>
                            {[1,2,3,4,5,6,7,8].map(s => (
                                <option key={s} value={s}>{s} Semester</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label><FaGraduationCap /> CGPA *</label>
                        <input
                            type="number"
                            name="cgpa"
                            value={formData.cgpa}
                            onChange={handleChange}
                            placeholder="e.g. 8.5"
                            step="0.01"
                            min="0"
                            max="10"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaCalendarAlt /> Batch *</label>
                        <input
                            type="text"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            placeholder="e.g. 2024"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaBuilding /> College Name *</label>
                        <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            placeholder="Enter college name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaGraduationCap /> 10th Percentage</label>
                        <input
                            type="number"
                            name="percentage10th"
                            value={formData.percentage10th}
                            onChange={handleChange}
                            placeholder="e.g. 85"
                            step="0.01"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-group">
                        <label><FaGraduationCap /> 12th Percentage</label>
                        <input
                            type="number"
                            name="percentage12th"
                            value={formData.percentage12th}
                            onChange={handleChange}
                            placeholder="e.g. 80"
                            step="0.01"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-group">
                        <label><FaCode /> Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g. Java, Python, React"
                        />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label><FaMapMarkerAlt /> Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        rows="3"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="save-btn"
                    disabled={updating}
                >
                    <FaSave />
                    {updating ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default Profile;