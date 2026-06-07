import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getJobs } from "../../services/jobService";
import { getRankings } from "../../services/rankingService";
import { compareCandidates } from "../../services/comparisonService";
import toast from "react-hot-toast";
import { FiUsers, FiTrendingUp, FiActivity, FiAward, FiCheck, FiInfo } from "react-icons/fi";

function CandidateComparison() {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [candidateAId, setCandidateAId] = useState("");
    const [candidateBId, setCandidateBId] = useState("");
    const [comparisonResult, setComparisonResult] = useState(null);
    const [comparing, setComparing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    const handleJobChange = async (jobId) => {
        setSelectedJobId(jobId);
        setCandidateAId("");
        setCandidateBId("");
        setComparisonResult(null);

        if (!jobId) {
            setCandidates([]);
            return;
        }

        try {
            const data = await getRankings(jobId);
            setCandidates(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch candidates for the selected job.");
        }
    };

    const handleCompare = async () => {
        if (!candidateAId || !candidateBId) {
            toast.error("Please select two candidates to compare.");
            return;
        }
        if (candidateAId === candidateBId) {
            toast.error("Please select two different candidates.");
            return;
        }

        const candA = candidates.find(c => c._id === candidateAId);
        const candB = candidates.find(c => c._id === candidateBId);

        if (!candA || !candB) {
            toast.error("Selected candidates could not be found.");
            return;
        }

        try {
            setComparing(true);
            const payloadA = {
                name: candA.candidateId?.userId?.name || "Candidate A",
                finalScore: candA.finalScore,
                atsScore: candA.atsAnalysis?.atsScore || 0,
                confidence: candA.recommendationData?.confidence || 0,
                skillMatch: candA.skillScore || 0,
                experienceScore: candA.experienceScore || 0
            };
            const payloadB = {
                name: candB.candidateId?.userId?.name || "Candidate B",
                finalScore: candB.finalScore,
                atsScore: candB.atsAnalysis?.atsScore || 0,
                confidence: candB.recommendationData?.confidence || 0,
                skillMatch: candB.skillScore || 0,
                experienceScore: candB.experienceScore || 0
            };

            const response = await compareCandidates(payloadA, payloadB);
            if (response.success) {
                setComparisonResult(response.data);
            } else {
                setComparisonResult(response);
            }
            toast.success("Comparison completed successfully!");
        } catch (error) {
            toast.error("Failed to compare candidates.");
            console.error(error);
        } finally {
            setComparing(false);
        }
    };

    const getCandidateName = (id) => {
        const cand = candidates.find(c => c._id === id);
        return cand?.candidateId?.userId?.name || "Candidate";
    };

    const candAObj = candidates.find(c => c._id === candidateAId);
    const candBObj = candidates.find(c => c._id === candidateBId);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Loading comparison module...</p>
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
                        <FiUsers className="text-indigo-400" /> Candidate Comparison
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Compare candidate applications side by side using weighted algorithm metrics and AI insights.</p>
                </div>

                {/* Job & Candidate Selector */}
                <div className="glass-card rounded-2xl p-6 shadow-xl">
                    <div className="grid md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">1. Select Job Posting</label>
                            <select
                                value={selectedJobId}
                                onChange={(e) => handleJobChange(e.target.value)}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                            >
                                <option value="" className="bg-zinc-950 text-zinc-300">Select a job...</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id} className="bg-zinc-950 text-zinc-300">{job.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">2. Select Candidate A</label>
                            <select
                                value={candidateAId}
                                onChange={(e) => setCandidateAId(e.target.value)}
                                disabled={!selectedJobId || candidates.length === 0}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-350 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-40"
                            >
                                <option value="" className="bg-zinc-950 text-zinc-350">Select Candidate A...</option>
                                {candidates.map((c) => (
                                    <option key={c._id} value={c._id} className="bg-zinc-950 text-zinc-300">
                                        {c.candidateId?.userId?.name || "Candidate"} (Score: {c.finalScore.toFixed(0)}%)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">3. Select Candidate B</label>
                            <select
                                value={candidateBId}
                                onChange={(e) => setCandidateBId(e.target.value)}
                                disabled={!selectedJobId || candidates.length === 0}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-350 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-40"
                            >
                                <option value="" className="bg-zinc-950 text-zinc-350">Select Candidate B...</option>
                                {candidates.map((c) => (
                                    <option key={c._id} value={c._id} className="bg-zinc-950 text-zinc-300">
                                        {c.candidateId?.userId?.name || "Candidate"} (Score: {c.finalScore.toFixed(0)}%)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCompare}
                            disabled={!candidateAId || !candidateBId || comparing}
                            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            <FiActivity />
                            {comparing ? "Comparing AI Data..." : "Run AI Comparison"}
                        </button>
                    </div>
                </div>

                {/* Comparison Visualizer */}
                {comparisonResult && candAObj && candBObj && (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* Winner Banner */}
                        <div className="bg-linear-to-r from-indigo-950/30 via-purple-950/30 to-cyan-950/20 border border-indigo-500/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                            <div>
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">AI Recommendation</span>
                                <h3 className="font-display text-2xl font-bold text-white mt-3">
                                    {comparisonResult.winner === "Tie"
                                        ? "It's a Tie!"
                                        : `${getCandidateName(comparisonResult.winner === "Candidate A" ? candidateAId : candidateBId)} is the winner!`}
                                </h3>
                                <p className="text-zinc-400 text-sm mt-1.5 font-light leading-relaxed">{comparisonResult.recommendation}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-zinc-900/60 px-4 py-2.5 rounded-xl border border-zinc-800 text-center min-w-28">
                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Candidate A</p>
                                    <p className="text-xl font-bold text-white mt-1">{comparisonResult.comparisonScore?.candidateA}%</p>
                                </div>
                                <div className="bg-zinc-900/60 px-4 py-2.5 rounded-xl border border-zinc-800 text-center min-w-28">
                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Candidate B</p>
                                    <p className="text-xl font-bold text-white mt-1">{comparisonResult.comparisonScore?.candidateB}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Side-by-Side Comparison Matrix */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Candidate A Card */}
                            <div className="glass-card rounded-2xl p-6 shadow-xl border border-zinc-900/60">
                                <div className="flex justify-between items-center border-b border-zinc-900/60 pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-white font-display">{getCandidateName(candidateAId)}</h3>
                                    <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">Candidate A</span>
                                </div>

                                <div className="space-y-6">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 text-center">
                                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">ATS Score</p>
                                            <p className="text-2xl font-bold text-white mt-1">{candAObj.atsAnalysis?.atsScore || 0}</p>
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded mt-1.5 inline-block">
                                                Grade: {candAObj.atsAnalysis?.grade || "N/A"}
                                            </span>
                                        </div>
                                        <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 text-center">
                                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Skill Match</p>
                                            <p className="text-2xl font-bold text-white mt-1">{candAObj.skillScore.toFixed(0)}%</p>
                                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded mt-1.5 inline-block">
                                                Exp Score: {candAObj.experienceScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Strengths & Weaknesses */}
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">AI Detected Strengths</h4>
                                        {(candAObj.explanation?.strengths || []).map((str, idx) => (
                                            <p key={idx} className="text-xs text-zinc-300 flex items-start gap-2 font-light">
                                                <FiCheck className="text-emerald-450 mt-0.5 flex-shrink-0" /> {str}
                                            </p>
                                        ))}
                                        {(candAObj.explanation?.strengths || []).length === 0 && (
                                            <p className="text-xs text-zinc-500 italic">No standout strengths detected</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Warning Indicators</h4>
                                        {(candAObj.explanation?.weaknesses || []).map((weak, idx) => (
                                            <p key={idx} className="text-xs text-zinc-350 flex items-start gap-2 font-light">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" /> {weak}
                                            </p>
                                        ))}
                                        {(candAObj.explanation?.weaknesses || []).length === 0 && (
                                            <p className="text-xs text-zinc-500 italic">No warnings or weaknesses found</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Candidate B Card */}
                            <div className="glass-card rounded-2xl p-6 shadow-xl border border-zinc-900/60">
                                <div className="flex justify-between items-center border-b border-zinc-900/60 pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-white font-display">{getCandidateName(candidateBId)}</h3>
                                    <span className="bg-purple-500/10 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20">Candidate B</span>
                                </div>

                                <div className="space-y-6">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 text-center">
                                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">ATS Score</p>
                                            <p className="text-2xl font-bold text-white mt-1">{candBObj.atsAnalysis?.atsScore || 0}</p>
                                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded mt-1.5 inline-block">
                                                Grade: {candBObj.atsAnalysis?.grade || "N/A"}
                                            </span>
                                        </div>
                                        <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 text-center">
                                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Skill Match</p>
                                            <p className="text-2xl font-bold text-white mt-1">{candBObj.skillScore.toFixed(0)}%</p>
                                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded mt-1.5 inline-block">
                                                Exp Score: {candBObj.experienceScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Strengths & Weaknesses */}
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">AI Detected Strengths</h4>
                                        {(candBObj.explanation?.strengths || []).map((str, idx) => (
                                            <p key={idx} className="text-xs text-zinc-300 flex items-start gap-2 font-light">
                                                <FiCheck className="text-emerald-450 mt-0.5 flex-shrink-0" /> {str}
                                            </p>
                                        ))}
                                        {(candBObj.explanation?.strengths || []).length === 0 && (
                                            <p className="text-xs text-zinc-500 italic">No standout strengths detected</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Warning Indicators</h4>
                                        {(candBObj.explanation?.weaknesses || []).map((weak, idx) => (
                                            <p key={idx} className="text-xs text-zinc-355 flex items-start gap-2 font-light">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" /> {weak}
                                            </p>
                                        ))}
                                        {(candBObj.explanation?.weaknesses || []).length === 0 && (
                                            <p className="text-xs text-zinc-500 italic">No warnings or weaknesses found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Advantage Summary */}
                        {comparisonResult.advantages && comparisonResult.advantages.length > 0 && (
                            <div className="glass-card rounded-2xl p-6 shadow-xl border border-zinc-900/60">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
                                    <FiAward className="text-indigo-400" /> Key Competitive Advantages
                                </h3>
                                <ul className="space-y-3">
                                    {comparisonResult.advantages.map((adv, idx) => (
                                        <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2 font-light">
                                            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                                                <FiCheck size={12} />
                                            </span>
                                            {adv}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default CandidateComparison;