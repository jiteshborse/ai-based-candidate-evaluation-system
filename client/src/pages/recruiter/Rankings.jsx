import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getJobs } from "../../services/jobService";
import { generateRanking, getRankings } from "../../services/rankingService";

function Rankings() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (!selectedJob) {
            setRankings([]);
            return;
        }

        fetchRankings(selectedJob);
    }, [selectedJob]);

    const fetchJobs = async () => {
        const data = await getJobs();
        setJobs(data.data || []);
    };

    const fetchRankings = async (jobId = selectedJob) => {
        if (!jobId) {
            setRankings([]);
            return;
        }

        const data = await getRankings(jobId);
        setRankings(data.data || []);
    };

    const handleGenerate = async () => {
        if (!selectedJob) {
            alert("Select a Job");
            return;
        }

        await generateRanking(selectedJob);
        await fetchRankings(selectedJob);
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Candidate Rankings</h1>

            <div className="bg-white p-4 rounded shadow mb-6">
                <select
                    className="border p-2 mr-4"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                >
                    <option value="">Select Job</option>
                    {jobs.map((job) => (
                        <option key={job._id} value={job._id}>
                            {job.title}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleGenerate}
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    Generate Ranking
                </button>
            </div>

            <div className="space-y-4">
                {rankings.length === 0 ? (
                    <div className="bg-white p-5 rounded shadow text-gray-600">
                        No rankings available.
                    </div>
                ) : (
                    rankings.map((item, index) => (
                        <div key={item._id || index} className="bg-white p-5 rounded shadow">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold">Rank #{index + 1}</h2>
                                <span className="text-green-600 font-bold">
                                    Score: {item.finalScore}
                                </span>
                            </div>

                            <div className="mt-3 space-y-1">
                                <p>ATS Score: {item.resumeAnalysis?.atsScore ?? "N/A"}</p>
                                <p>Resume Grade: {item.resumeAnalysis?.grade ?? "N/A"}</p>
                                <p>Skill Match: {item.skillGap?.matchPercentage ?? 0}%</p>
                            </div>

                            <div className="mt-4 space-y-2">
                                <h3 className="font-bold">Recommendation</h3>
                                <p>{item.recommendationData?.recommendation ?? "N/A"}</p>
                                <p>Confidence: {item.recommendationData?.confidence ?? 0}%</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-bold">Missing Skills</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(item.skillGap?.missingSkills || []).map((skill) => (
                                        <span
                                            key={skill}
                                            className="bg-red-100 px-2 py-1 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-bold">AI Insights</h3>
                                <div className="mt-2 space-y-1">
                                    {(item.explanation?.strengths || []).map((reason, reasonIndex) => (
                                        <p key={reasonIndex}>✓ {reason}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}

export default Rankings;
