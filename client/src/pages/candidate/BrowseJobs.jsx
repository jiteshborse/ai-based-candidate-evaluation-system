import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getJobs } from "../../services/jobService";
import { getResumes } from "../../services/resumeService";
import { applyToJob, getMyApplications } from "../../services/applicationService";
import toast from "react-hot-toast";
import { FiBriefcase, FiCheckCircle, FiFileText, FiAward, FiBookOpen, FiSend, FiXCircle } from "react-icons/fi";

function BrowseJobs() {
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const jobsData = await getJobs();
            const resumesData = await getResumes();
            const appsData = await getMyApplications();

            setJobs(jobsData.data || []);
            setResumes(resumesData.data || []);
            setMyApplications(appsData.data || []);
        } catch (error) {
            console.error("Error loading data", error);
            toast.error("Failed to load jobs or profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const hasApplied = (jobId) => {
        return myApplications.some(app => app.jobId?._id === jobId || app.jobId === jobId);
    };

    const handleApply = async () => {
        if (!selectedResumeId) {
            toast.error("Please select a resume.");
            return;
        }

        try {
            setSubmitting(true);
            await applyToJob(selectedJob._id, selectedResumeId);
            toast.success("Applied successfully!");
            setSelectedJob(null);
            setSelectedResumeId("");
            // Reload applications
            const appsData = await getMyApplications();
            setMyApplications(appsData.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Finding opportunities...</p>
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
                        <FiBriefcase className="text-indigo-400" /> Explore Opportunities
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Browse active postings and apply with your optimized AI resume.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Jobs List */}
                    <div className="md:col-span-2 space-y-6">
                        {jobs.length === 0 ? (
                            <div className="glass-card rounded-2xl p-8 text-center text-zinc-500 shadow-xl">
                                <p className="font-semibold text-zinc-350">No jobs available</p>
                                <p className="text-xs text-zinc-500 mt-1">Check back later for new career opportunities.</p>
                            </div>
                        ) : (
                            jobs.map(job => {
                                const applied = hasApplied(job._id);
                                return (
                                    <div
                                        key={job._id}
                                        className="glass-card p-6 rounded-2xl shadow-xl flex flex-col justify-between border border-zinc-900/60 hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h2 className="text-xl font-bold text-white font-display group-hover:text-indigo-400 transition-colors">{job.title}</h2>
                                                {applied && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-inner">
                                                        <FiCheckCircle className="shrink-0" /> Applied
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-zinc-400 text-sm mt-3 leading-relaxed font-light">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-4 text-xs">
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-400">
                                                    <FiAward className="text-indigo-455" />
                                                    Required Exp: {job.experienceMin || 0}+ Years
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-400">
                                                    <FiBookOpen className="text-purple-455" />
                                                    Edu level: {job.educationLevel || "Any"}
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Required Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.requiredSkills?.map(skill => (
                                                        <span
                                                            key={skill}
                                                            className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium px-2.5 py-0.5 rounded-lg text-xs"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {!applied && (
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    onClick={() => setSelectedJob(job)}
                                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                                >
                                                    Apply Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Applications Tracker */}
                    <div className="md:col-span-1">
                        <div className="glass-card rounded-2xl shadow-xl p-6 sticky top-24">
                            <h3 className="text-md font-bold text-white mb-5 flex items-center gap-2 font-display">
                                <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <FiCheckCircle />
                                </span>
                                Your Applications
                            </h3>

                            {myApplications.length === 0 ? (
                                <p className="text-xs text-zinc-500 font-light">You haven't submitted any job applications yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map(app => (
                                        <div key={app._id} className="border-b border-zinc-900/60 pb-3 last:border-0 last:pb-0 font-light">
                                            <h4 className="font-semibold text-sm text-zinc-200">{app.jobId?.title || "Unknown Job"}</h4>
                                            <div className="flex items-center justify-between mt-1.5 text-xs text-zinc-500">
                                                <span className="flex items-center gap-1 text-[11px] truncate max-w-[120px]">
                                                    <FiFileText size={12} className="shrink-0" />
                                                    {app.resumeId?.fileName || "Resume"}
                                                </span>
                                                <span className="capitalize font-bold text-[9px] tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Application Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
                        <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-800/80 animate-fade-in">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white font-display">Apply for {selectedJob.title}</h3>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                                >
                                    <FiXCircle size={20} />
                                </button>
                            </div>

                            {resumes.length === 0 ? (
                                <div className="py-4 text-center space-y-4">
                                    <p className="text-sm text-zinc-400 font-light">You must upload a resume before you can apply to jobs.</p>
                                    <button
                                        onClick={() => window.location.href = "/upload-resume"}
                                        className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                                    >
                                        Upload Resume
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Select Resume</label>
                                        <select
                                            value={selectedResumeId}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-305 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                        >
                                            <option value="" className="bg-zinc-950 text-zinc-350">Choose an uploaded resume...</option>
                                            {resumes.map(res => (
                                                <option key={res._id} value={res._id} className="bg-zinc-950 text-zinc-300">
                                                    {res.fileName} (ATS: {res.extractedData?.skills?.length || 0} skills)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 border-t border-zinc-900/60 pt-4">
                                        <button
                                            onClick={() => setSelectedJob(null)}
                                            className="border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApply}
                                            disabled={submitting}
                                            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
                                        >
                                            <FiSend size={12} />
                                            {submitting ? "Applying..." : "Confirm Application"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default BrowseJobs;
