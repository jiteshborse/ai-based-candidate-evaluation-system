import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDashboardStats } from "../../services/analyticsService";
import { 
    PieChart, Pie, Cell, BarChart, Bar, 
    XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";
import { FiUsers, FiBriefcase, FiFileText, FiTrendingUp } from "react-icons/fi";

const COLORS = ["#6366F1", "#A855F7", "#06B6D4", "#F59E0B"];

function Analytics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                setStats(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!stats) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Loading analytics modules...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiTrendingUp className="text-indigo-400" /> Analytics Dashboard
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Review system distributions, top extracted skillsets, and hiring rates.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Candidates */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-indigo-500/20 hover:scale-[1.02] transition-all duration-350 group">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Candidates</p>
                            <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-indigo-400 transition-colors">{stats.totalCandidates}</h3>
                        </div>
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition-all">
                            <FiUsers size={20} />
                        </div>
                    </div>

                    {/* Recruiters */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-purple-500/20 hover:scale-[1.02] transition-all duration-350 group">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Recruiters</p>
                            <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-purple-400 transition-colors">{stats.totalRecruiters}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl group-hover:bg-purple-500/20 transition-all">
                            <FiUsers size={20} />
                        </div>
                    </div>

                    {/* Jobs */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-cyan-500/20 hover:scale-[1.02] transition-all duration-350 group">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Jobs</p>
                            <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-cyan-400 transition-colors">{stats.totalJobs}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:bg-cyan-500/20 transition-all">
                            <FiBriefcase size={20} />
                        </div>
                    </div>

                    {/* Resumes */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 flex items-center justify-between hover:border-emerald-500/20 hover:scale-[1.02] transition-all duration-350 group">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Resumes Indexed</p>
                            <h3 className="text-3xl font-bold font-display text-white mt-1.5 group-hover:text-emerald-400 transition-colors">{stats.totalResumes}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                            <FiFileText size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ATS Distribution Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 shadow-xl">
                        <h2 className="text-md font-semibold text-white mb-6 font-display flex items-center gap-2">
                            <span className="w-1.5 h-3 rounded-full bg-indigo-500"></span>
                            ATS Score Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats.atsDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="range" stroke="#71717a" fontSize={10} tickLine={false} />
                                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                                    itemStyle={{ color: '#a1a1aa', fontSize: '12px' }}
                                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Skills Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 shadow-xl">
                        <h2 className="text-md font-semibold text-white mb-6 font-display flex items-center gap-2">
                            <span className="w-1.5 h-3 rounded-full bg-cyan-500"></span>
                            Top Parsed Skillsets
                        </h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats.topSkills} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="skill" stroke="#71717a" fontSize={10} tickLine={false} />
                                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                                    itemStyle={{ color: '#a1a1aa', fontSize: '12px' }}
                                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recommendation Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/60 shadow-xl lg:col-span-2">
                        <h2 className="text-md font-semibold text-white mb-6 font-display flex items-center gap-2">
                            <span className="w-1.5 h-3 rounded-full bg-purple-500"></span>
                            Hiring Recommendations Overview
                        </h2>
                        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                            <div className="w-full max-w-[280px]">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={stats.recommendationStats}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={80}
                                            innerRadius={50}
                                            paddingAngle={2}
                                        >
                                            {stats.recommendationStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                                            itemStyle={{ color: '#a1a1aa', fontSize: '12px' }}
                                            labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            {/* Legend details */}
                            <div className="grid grid-cols-2 gap-4 text-xs font-light text-zinc-400">
                                {stats.recommendationStats.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="font-medium text-white">{entry.value}</span>
                                        <span>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default Analytics;