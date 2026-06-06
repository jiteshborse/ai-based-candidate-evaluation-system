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
                finalScore: candA.finalScore,
                atsScore: candA.atsAnalysis?.atsScore || 0,
                confidence: candA.recommendationData?.confidence || 0,
                skillMatch: candA.skillScore || 0,
                experienceScore: candA.experienceScore || 0
            };
            const payloadB = {
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
                    <p className="text-gray-500 font-semibold animate-pulse text-lg">Loading comparison module...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <FiUsers className="text-blue-600" /> Candidate Comparison
                    </h1>
                    <p className="text-gray-500 mt-1">Compare candidate applications side by side using weighted algorithm metrics and AI insights.</p>
                </div>

                {/* Job & Candidate Selector */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
                    <div className="grid md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">1. Select Job Posting</label>
                            <select
                                value={selectedJobId}
                                onChange={(e) => handleJobChange(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                            >
                                <option value="">Select a job...</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id}>{job.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">2. Select Candidate A</label>
                            <select
                                value={candidateAId}
                                onChange={(e) => setCandidateAId(e.target.value)}
                                disabled={!selectedJobId || candidates.length === 0}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">Select Candidate A...</option>
                                {candidates.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.candidateId?.userId?.name || "Candidate"} (Score: {c.finalScore})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">3. Select Candidate B</label>
                            <select
                                value={candidateBId}
                                onChange={(e) => setCandidateBId(e.target.value)}
                                disabled={!selectedJobId || candidates.length === 0}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">Select Candidate B...</option>
                                {candidates.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.candidateId?.userId?.name || "Candidate"} (Score: {c.finalScore})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCompare}
                            disabled={!candidateAId || !candidateBId || comparing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                        >
                            <FiActivity />
                            {comparing ? "Comparing AI Data..." : "Run AI Comparison"}
                        </button>
                    </div>
                </div>

                {/* Comparison Visualizer */}
                {comparisonResult && candAObj && candBObj && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Winner Banner */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">AI Recommendation</span>
                                <h3 className="text-2xl font-black text-gray-900 mt-2">
                                    {comparisonResult.winner === "Tie"
                                        ? "It's a Tie!"
                                        : `${getCandidateName(comparisonResult.winner === "Candidate A" ? candidateAId : candidateBId)} is the winner!`}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">{comparisonResult.recommendation}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-50 text-center">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate A Score</p>
                                    <p className="text-xl font-bold text-gray-800 mt-0.5">{comparisonResult.comparisonScore?.candidateA}%</p>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-50 text-center">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate B Score</p>
                                    <p className="text-xl font-bold text-gray-800 mt-0.5">{comparisonResult.comparisonScore?.candidateB}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Side-by-Side Comparison Matrix */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Candidate A Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{getCandidateName(candidateAId)}</h3>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-100">Candidate A</span>
                                </div>

                                <div className="space-y-4">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3.5 rounded-xl text-center">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">ATS Score</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{candAObj.atsAnalysis?.atsScore || 0}</p>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                                                Grade: {candAObj.atsAnalysis?.grade || "N/A"}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-3.5 rounded-xl text-center">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Skill Match</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{candAObj.skillScore.toFixed(0)}%</p>
                                            <span className="text-xs font-bold text-gray-400 mt-1 inline-block">
                                                Exp: {candAObj.experienceScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Strengths & Weaknesses */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Strengths</h4>
                                        <div className="space-y-1.5">
                                            {(candAObj.explanation?.strengths || []).map((str, idx) => (
                                                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1.5">
                                                    <FiCheck className="text-green-500 flex-shrink-0" /> {str}
                                                </p>
                                            ))}
                                            {(candAObj.explanation?.strengths || []).length === 0 && (
                                                <p className="text-xs text-gray-400 italic">No standout strengths detected</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weaknesses</h4>
                                        <div className="space-y-1.5">
                                            {(candAObj.explanation?.weaknesses || []).map((weak, idx) => (
                                                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /> {weak}
                                                </p>
                                            ))}
                                            {(candAObj.explanation?.weaknesses || []).length === 0 && (
                                                <p className="text-xs text-gray-400 italic">No warnings or weaknesses found</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Candidate B Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{getCandidateName(candidateBId)}</h3>
                                    <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full border border-indigo-100">Candidate B</span>
                                </div>

                                <div className="space-y-4">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3.5 rounded-xl text-center">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">ATS Score</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{candBObj.atsAnalysis?.atsScore || 0}</p>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                                                Grade: {candBObj.atsAnalysis?.grade || "N/A"}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-3.5 rounded-xl text-center">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Skill Match</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{candBObj.skillScore.toFixed(0)}%</p>
                                            <span className="text-xs font-bold text-gray-400 mt-1 inline-block">
                                                Exp: {candBObj.experienceScore.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Strengths & Weaknesses */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Strengths</h4>
                                        <div className="space-y-1.5">
                                            {(candBObj.explanation?.strengths || []).map((str, idx) => (
                                                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1.5">
                                                    <FiCheck className="text-green-500 flex-shrink-0" /> {str}
                                                </p>
                                            ))}
                                            {(candBObj.explanation?.strengths || []).length === 0 && (
                                                <p className="text-xs text-gray-400 italic">No standout strengths detected</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weaknesses</h4>
                                        <div className="space-y-1.5">
                                            {(candBObj.explanation?.weaknesses || []).map((weak, idx) => (
                                                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /> {weak}
                                                </p>
                                            ))}
                                            {(candBObj.explanation?.weaknesses || []).length === 0 && (
                                                <p className="text-xs text-gray-400 italic">No warnings or weaknesses found</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Advantage Summary */}
                        {comparisonResult.advantages && comparisonResult.advantages.length > 0 && (
                            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiAward className="text-blue-500" /> Key Competitive Advantages
                                </h3>
                                <ul className="space-y-2">
                                    {comparisonResult.advantages.map((adv, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                            <span className="p-1 rounded bg-green-50 text-green-700 border border-green-100">
                                                <FiCheck size={14} />
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