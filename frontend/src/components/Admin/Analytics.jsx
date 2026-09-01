import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../context/AuthContext";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";
import "./Analytics.css";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    ArcElement, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
    FaUsers, FaBriefcase, FaFileAlt, FaChartBar,
    FaCheckCircle, FaTimesCircle, FaClock, FaGraduationCap,
    FaLock, FaChartLine, FaChartPie, FaBuilding,
} from "react-icons/fa";
import "./Analytics.css";

// Register ChartJS
ChartJS.register(
    CategoryScale, LinearScale, BarElement,
    ArcElement, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
);

const Analytics = () => {
    const { isAuthorized, user } = useContext(Context);
    const [overview, setOverview] = useState(null);
    const [branches, setBranches] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [monthly, setMonthly] = useState(null);
    const [cgpaData, setCgpaData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthorized && user?.role === "admin") {
            fetchAllData();
        }
    }, [isAuthorized, user]);

    const fetchAllData = async () => {
        try {
            const [overviewRes, branchRes, companyRes, monthlyRes, cgpaRes] = await Promise.all([
                API.get("/analytics/overview"),
                API.get("/analytics/branches"),
                API.get("/analytics/companies"),
                API.get("/analytics/monthly"),
                API.get("/analytics/cgpa")
            ]);

            setOverview(overviewRes.data.overview);
            setBranches(branchRes.data.branches || []);
            setCompanies(companyRes.data.companies || []);
            setMonthly(monthlyRes.data.monthly);
            setCgpaData(cgpaRes.data.distribution || []);
        } catch (error) {
            console.error("Analytics error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthorized) return <Navigate to="/login" />;
    if (user?.role !== "admin") {
        return <AdminLayout><div className="access-denied"><FaLock /><h2>Access Denied</h2></div></AdminLayout>;
    }

    // ===== Chart Colors =====
    const colors = {
        purple: '#6c63ff',
        green: '#27ae60',
        red: '#e74c3c',
        orange: '#f39c12',
        teal: '#4ecdc4',
        blue: '#3498db',
        pink: '#e91e63'
    };

    // ===== Application Status Chart =====
    const statusChartData = {
        labels: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
        datasets: [{
            data: [
                overview?.appliedCount || 0,
                overview?.shortlistedCount || 0,
                overview?.selectedCount || 0,
                overview?.rejectedCount || 0
            ],
            backgroundColor: [colors.orange, colors.teal, colors.purple, colors.red],
            borderWidth: 0,
            cutout: '65%'
        }]
    };

    // ===== Branch Chart =====
    const branchChartData = {
        labels: branches.map(b => b.branch),
        datasets: [
            {
                label: 'Total Students',
                data: branches.map(b => b.totalStudents),
                backgroundColor: colors.purple + '60',
                borderColor: colors.purple,
                borderWidth: 2,
                borderRadius: 6
            },
            {
                label: 'Placed',
                data: branches.map(b => b.placed),
                backgroundColor: colors.green + '60',
                borderColor: colors.green,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    // ===== Company Chart =====
    const companyChartData = {
        labels: companies.map(c => c._id),
        datasets: [
            {
                label: 'Applications',
                data: companies.map(c => c.totalApplications),
                backgroundColor: colors.purple + '60',
                borderColor: colors.purple,
                borderWidth: 2,
                borderRadius: 6
            },
            {
                label: 'Selected',
                data: companies.map(c => c.selected),
                backgroundColor: colors.green + '60',
                borderColor: colors.green,
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    // ===== Monthly Trend Chart =====
    const monthlyChartData = {
        labels: monthly?.applications?.map(a => a.label) || [],
        datasets: [
            {
                label: 'Applications',
                data: monthly?.applications?.map(a => a.total) || [],
                borderColor: colors.purple,
                backgroundColor: colors.purple + '20',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: colors.purple
            },
            {
                label: 'Selected',
                data: monthly?.applications?.map(a => a.selected) || [],
                borderColor: colors.green,
                backgroundColor: colors.green + '20',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: colors.green
            }
        ]
    };

    // ===== CGPA Chart =====
    const cgpaChartData = {
        labels: cgpaData.map(c => c.label),
        datasets: [{
            data: cgpaData.map(c => c.count),
            backgroundColor: [
                colors.purple, colors.teal, colors.blue,
                colors.green, colors.orange, colors.red
            ],
            borderWidth: 0
        }]
    };

    // ===== Profile Chart =====
    const profileChartData = {
        labels: ['Complete', 'Incomplete'],
        datasets: [{
            data: [overview?.profileComplete || 0, overview?.profileIncomplete || 0],
            backgroundColor: [colors.green, colors.orange],
            borderWidth: 0,
            cutout: '65%'
        }]
    };

    // Chart Options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, usePointStyle: true } }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 12 }, usePointStyle: true, padding: 15 } }
        }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, usePointStyle: true } }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } }
        }
    };

    return (
        <AdminLayout>
            <div className="analytics-page">
                <div className="page-header">
                    <h2><FaChartBar /> Analytics Dashboard</h2>
                    <p>Detailed placement statistics and insights</p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* ===== Overview Stats ===== */}
                        <div className="overview-grid">
                            <div className="overview-card purple">
                                <FaUsers />
                                <div>
                                    <span className="ov-num">{overview?.totalStudents || 0}</span>
                                    <span className="ov-label">Students</span>
                                </div>
                            </div>
                            <div className="overview-card blue">
                                <FaBriefcase />
                                <div>
                                    <span className="ov-num">{overview?.totalJobs || 0}</span>
                                    <span className="ov-label">Total Jobs</span>
                                </div>
                            </div>
                            <div className="overview-card teal">
                                <FaFileAlt />
                                <div>
                                    <span className="ov-num">{overview?.totalApplications || 0}</span>
                                    <span className="ov-label">Applications</span>
                                </div>
                            </div>
                            <div className="overview-card green">
                                <FaCheckCircle />
                                <div>
                                    <span className="ov-num">{overview?.selectedCount || 0}</span>
                                    <span className="ov-label">Placed</span>
                                </div>
                            </div>
                            <div className="overview-card orange">
                                <FaClock />
                                <div>
                                    <span className="ov-num">{overview?.shortlistedCount || 0}</span>
                                    <span className="ov-label">Shortlisted</span>
                                </div>
                            </div>
                            <div className="overview-card red">
                                <FaTimesCircle />
                                <div>
                                    <span className="ov-num">{overview?.rejectedCount || 0}</span>
                                    <span className="ov-label">Rejected</span>
                                </div>
                            </div>
                        </div>

                        {/* ===== Charts Row 1 ===== */}
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3><FaChartPie /> Application Status</h3>
                                <div className="chart-wrap">
                                    <Doughnut data={statusChartData} options={doughnutOptions} />
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3><FaChartLine /> Monthly Trends</h3>
                                <div className="chart-wrap">
                                    <Line data={monthlyChartData} options={lineOptions} />
                                </div>
                            </div>
                        </div>

                        {/* ===== Charts Row 2 ===== */}
                        <div className="charts-grid">
                            <div className="chart-card wide">
                                <h3><FaGraduationCap /> Branch Wise Analysis</h3>
                                <div className="chart-wrap">
                                    <Bar data={branchChartData} options={barOptions} />
                                </div>
                            </div>
                        </div>

                        {/* ===== Charts Row 3 ===== */}
                        <div className="charts-grid">
                            <div className="chart-card wide">
                                <h3><FaBuilding /> Company Wise Applications</h3>
                                <div className="chart-wrap">
                                    <Bar data={companyChartData} options={barOptions} />
                                </div>
                            </div>
                        </div>

                        {/* ===== Charts Row 4 ===== */}
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3><FaGraduationCap /> CGPA Distribution</h3>
                                <div className="chart-wrap">
                                    <Pie data={cgpaChartData} options={doughnutOptions} />
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3><FaUsers /> Profile Completion</h3>
                                <div className="chart-wrap">
                                    <Doughnut data={profileChartData} options={doughnutOptions} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Analytics;