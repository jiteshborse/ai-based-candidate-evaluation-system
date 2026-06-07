import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getJobs } from "../../services/jobService";
import { generateRanking, getRankings } from "../../services/rankingService";
import toast from "react-hot-toast";
import { FiAward, FiBook, FiCheckCircle, FiAlertTriangle, FiSliders, FiList } from "react-icons/fi";

function Rankings() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [rankings, setRankings] = useState([]);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!selectedJob) {
            toast.error("Please select a job posting.");
            return;
        }

        setGenerating(true);
        toast.loading("Analyzing candidates and generating AI scores...", { id: "generating-rankings-toast" });
        try {
            await generateRanking(selectedJob);
            const freshData = await getRankings(selectedJob);
            setRankings(freshData.data || []);
            toast.success("Rankings generated successfully!", { id: "generating-rankings-toast" });
        } catch (error) {
            toast.error("Failed to generate rankings.", { id: "generating-rankings-toast" });
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        loadJobs();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiAward className="text-indigo-400" /> Candidate Rankings
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Screen, sort, and rank candidate profiles using automated semantic AI parsing.</p>
                </div>

                {/* Select Job Posting & Action */}
                <div className="glass-card p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                        className="flex-grow bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                        value={selectedJob}
                        onChange={(e) => {
                            const nextJobId = e.target.value;
                            setSelectedJob(nextJobId);
                            setRankings([]);
                        }}
                    >
                        <option value="" className="bg-zinc-950 text-zinc-300">Select Job Posting...</option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id} className="bg-zinc-950 text-zinc-300">
                                {job.title}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleGenerate}
                        disabled={generating || !selectedJob}
                        className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                        {generating ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analysing...
                            </>
                        ) : (
                            <>
                                <FiSliders />
                                Generate Ranking
                            </>
                        )}
                    </button>
                </div>

                {/* Rankings Showcase */}
                <div className="space-y-4">
                    {rankings.length === 0 ? (
                        <div className="glass-card p-8 rounded-2xl text-center text-zinc-500 shadow-xl">
                            <FiList className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                            <p className="font-semibold text-zinc-350">No rankings loaded</p>
                            <p className="text-xs text-zinc-500 mt-1">Select a job posting above to display or compile rank results.</p>
                        </div>
                    ) : (
                        rankings.map((item, index) => {
                            const isTop3 = index < 3;
                            const placementColor = 
                                index === 0 ? "border-amber-500/40 bg-amber-500/5 shadow-amber-500/5" :
                                index === 1 ? "border-slate-400/40 bg-slate-450/5 shadow-slate-450/5" :
                                index === 2 ? "border-amber-700/40 bg-amber-750/5 shadow-amber-750/5" :
                                "border-zinc-900 bg-zinc-950/20";

                            return (
                                <div 
                                    key={item._id || index} 
                                    className={`glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300 border ${placementColor}`}
                                >
                                    {/* Header Row */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-900/60 pb-5 mb-5">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm ${
                                                index === 0 ? "bg-amber-500 text-zinc-950" :
                                                index === 1 ? "bg-slate-400 text-zinc-950" :
                                                index === 2 ? "bg-amber-700 text-white" :
                                                "bg-zinc-900 border border-zinc-800 text-zinc-400"
                                            }`}>
                                                #{index + 1}
                                            </span>
                                            <div>
                                                <h2 className="text-lg font-bold text-white font-display">
                                                    {item.candidateId?.userId?.name || "Candidate Profile"}
                                                </h2>
                                                <p className="text-xs text-zinc-400 mt-0.5">{item.candidateId?.userId?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-zinc-500">Weight Score:</span>
                                            <span className="text-lg font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full shadow-inner">
                                                {item.finalScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Evaluation Sub Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        
                                        {/* Core Scores card */}
                                        <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Resume Scores</h4>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between items-center text-zinc-400">
                                                    <span>ATS Score:</span>
                                                    <span className="font-semibold text-white">{item.resumeAnalysis?.atsScore ?? "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-zinc-400">
                                                    <span>File Grade:</span>
                                                    <span className={`font-semibold px-2 py-0.5 rounded ${
                                                        item.resumeAnalysis?.grade === "A" ? "bg-emerald-500/10 text-emerald-400" :
                                                        item.resumeAnalysis?.grade === "B" ? "bg-indigo-500/10 text-indigo-400" :
                                                        "bg-amber-500/10 text-amber-400"
                                                    }`}>{item.resumeAnalysis?.grade ?? "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-zinc-400">
                                                    <span>Skill Match Percentage:</span>
                                                    <span className="font-semibold text-white">{item.skillGap?.matchPercentage ?? 0}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recommendation details */}
                                        <div className="space-y-2.5">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Recruiter Verdict</h4>
                                            <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                                {item.recommendationData?.recommendation ?? "N/A"}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                                                <span>Confidence:</span>
                                                <span className="font-semibold text-white">{item.recommendationData?.confidence ?? 0}%</span>
                                            </div>
                                        </div>

                                        {/* Missing skills */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Missing Job Skills</h4>
                                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                                {(item.skillGap?.missingSkills || []).length > 0 ? (
                                                    (item.skillGap?.missingSkills || []).map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded text-[10px] font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-emerald-450 italic flex items-center gap-1.5">
                                                        <FiCheckCircle /> Perfect skill match!
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    {/* Strengths / AI insights */}
                                    <div className="mt-6 pt-5 border-t border-zinc-900/60">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">AI Strength Explanations</h4>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {(item.explanation?.strengths || []).map((reason, reasonIndex) => (
                                                <div key={reasonIndex} className="flex items-start gap-2 text-xs text-zinc-300 font-light">
                                                    <FiCheckCircle className="text-emerald-450 mt-0.5 flex-shrink-0" />
                                                    <span>{reason}</span>
                                                </div>
                                            ))}
                                            {(item.explanation?.strengths || []).length === 0 && (
                                                <p className="text-xs text-zinc-500 italic">No strength details loaded</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Rankings;
