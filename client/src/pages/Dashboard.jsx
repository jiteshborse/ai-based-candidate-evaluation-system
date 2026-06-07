import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
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
                if (response.success && response.data) {
                    setStats(response.data);
                } else if (response.totalJobs) {
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
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Loading statistics...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
                
                {/* Welcome Card Banner */}
                <div className="bg-linear-to-r from-indigo-950/30 via-purple-950/30 to-cyan-950/20 border border-indigo-500/20 rounded-3xl p-8 text-zinc-100 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-10 -translate-y-10 scale-150 text-indigo-400 pointer-events-none">
                        <FiTrendingUp size={240} />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                        Welcome Back, <span className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{user?.name || "User"}</span>!
                    </h1>
                    <p className="mt-2 text-zinc-400 max-w-xl font-light leading-relaxed text-sm">
                        {user?.role === "recruiter"
                            ? "Review job applications, evaluate candidate resumes, and let our AI models highlight the best matches."
                            : "Upload your resume, analyze its ATS optimization score, and apply to job opportunities."}
                    </p>
                </div>

                {/* Dashboard Stats */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-display">
                        <FiLayers className="text-indigo-400" /> Platform Insights
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Stat: Total Jobs */}
                        <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-indigo-500/30 hover:scale-[1.02] transition-all duration-300 group">
                            <div>
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Jobs</p>
                                <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-indigo-400 transition-colors">{stats?.totalJobs ?? 0}</h3>
                            </div>
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
                                <FiBriefcase size={22} />
                            </div>
                        </div>

                        {/* Stat: Candidates */}
                        <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300 group">
                            <div>
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Candidates</p>
                                <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-purple-400 transition-colors">{stats?.totalCandidates ?? 0}</h3>
                            </div>
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all">
                                <FiUsers size={22} />
                            </div>
                        </div>

                        {/* Stat: Resumes Indexed */}
                        <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-cyan-500/30 hover:scale-[1.02] transition-all duration-300 group">
                            <div>
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Resumes Indexed</p>
                                <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-cyan-400 transition-colors">{stats?.totalResumes ?? 0}</h3>
                            </div>
                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all">
                                <FiFileText size={22} />
                            </div>
                        </div>

                        {/* Stat: Applications */}
                        <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300 group">
                            <div>
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Applications</p>
                                <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-emerald-400 transition-colors">{stats?.totalApplications ?? 0}</h3>
                            </div>
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all">
                                <FiTrendingUp size={22} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;