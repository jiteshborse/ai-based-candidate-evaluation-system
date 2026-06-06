import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import { getDashboardStats } from "../services/analyticsService";
import { useAuth } from "../context/AuthContext";
import { FiBriefcase, FiUsers, FiFileText, FiLayers, FiTrendingUp } from "react-icons/fi";

function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await getDashboardStats();
                // response is { success: true, data: { ... } }
                if (response.success && response.data) {
                    setStats(response.data);
                } else if (response.totalJobs) {
                    // fallback if response structure was flat
                    setStats(response);
                }
            } catch (error) {
                console.error("Error loading dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500 font-semibold animate-pulse text-lg">Loading statistics...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 scale-150">
                        <FiTrendingUp size={240} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Welcome Back, {user?.name || "User"}!
                    </h1>
                    <p className="mt-2 text-blue-100 max-w-xl">
                        {user?.role === "recruiter"
                            ? "Review job applications, evaluate candidate resumes, and let our AI models highlight the best matches."
                            : "Upload your resume, analyze its ATS optimization score, and apply to job opportunities."}
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-950 mb-6 flex items-center gap-2">
                    <FiLayers className="text-blue-600" /> Platform Insights
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Jobs</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalJobs ?? 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FiBriefcase size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Candidates</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalCandidates ?? 0}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <FiUsers size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resumes Indexed</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalResumes ?? 0}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FiFileText size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Applications</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats?.totalApplications ?? 0}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <FiTrendingUp size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;