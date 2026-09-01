import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ContextProvider } from "./context/AuthContext";

// Layout
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// ✅ NEW: Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import SavedJobs from "./components/Job/SavedJobs";
import NotFound from "./components/NotFound/NotFound";

// Student Pages
import MyApplications from "./components/Application/MyApplications";
import Profile from "./components/Student/Profile";
import Notifications from "./components/Student/Notifications";

// Admin Pages
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageJobs from "./components/Admin/ManageJobs";
import CreateJob from "./components/Admin/CreateJob";
import EditJob from "./components/Admin/EditJob";
import Applications from "./components/Admin/Applications";
import ManageStudents from "./components/Admin/ManageStudents";
import SendNotification from "./components/Admin/SendNotification";
import StudentDashboard from "./components/Student/StudentDashboard";
import InterviewManage from "./components/Admin/InterviewManage";
import InterviewSchedule from "./components/Student/InterviewSchedule";
import Analytics from "./components/Admin/Analytics";

import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import "./App.css";

const App = () => {
    return (
        <ContextProvider>
            <Router>
                <ScrollToTop />
                <Navbar />
                <Routes>
                    {/* ===== Public Routes ===== */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/job/:id" element={<JobDetails />} />

                    {/* ===== Student Protected Routes ===== */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />

                    <Route 
                        path="/applications/me" 
                        element={
                            <ProtectedRoute>
                                <MyApplications />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/notifications" 
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        } 
                    />

                    {/* ===== NEW FEATURE: Saved Jobs ===== */}
                    <Route 
                        path="/saved-jobs" 
                        element={
                            <ProtectedRoute>
                                <SavedJobs />
                            </ProtectedRoute>
                        } 
                    />

                    {/* ===== Admin Protected Routes ===== */}
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/jobs" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManageJobs />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/jobs/create" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <CreateJob />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/jobs/edit/:id" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <EditJob />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/applications" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <Applications />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/students" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManageStudents />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/notifications" 
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <SendNotification />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Student Interview Route */}
                        <Route
                            path="/interviews"
                            element={
                                <ProtectedRoute>
                                    <InterviewSchedule />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Interview Route */}
                        <Route
                            path="/admin/interviews"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <InterviewManage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/analytics"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <Analytics />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* ===== 404 ===== */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <Toaster />
            </Router>
        </ContextProvider>
    );
};

export default App;