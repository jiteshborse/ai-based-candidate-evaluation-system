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
                    <p className="text-gray-500 font-semibold animate-pulse text-lg">Finding opportunities...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <FiBriefcase className="text-blue-600" /> Explore Opportunities
                    </h1>
                    <p className="text-gray-500 mt-1">Browse active postings and apply with your optimized AI resume.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Jobs List */}
                    <div className="md:col-span-2 space-y-6">
                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                                <p className="font-semibold text-gray-700">No jobs available</p>
                                <p className="text-sm text-gray-400 mt-1">Check back later for new career opportunities.</p>
                            </div>
                        ) : (
                            jobs.map(job => {
                                const applied = hasApplied(job._id);
                                return (
                                    <div
                                        key={job._id}
                                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                                                {applied && (
                                                    <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">
                                                        <FiCheckCircle /> Applied
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg">
                                                    <FiAward className="text-blue-500" />
                                                    Required Exp: {job.experienceMin || 0}+ Years
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg">
                                                    <FiBookOpen className="text-indigo-500" />
                                                    Edu level: {job.educationLevel || "Any"}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.requiredSkills?.map(skill => (
                                                        <span
                                                            key={skill}
                                                            className="bg-blue-50/70 border border-blue-100 text-blue-700 font-medium px-2.5 py-0.5 rounded-lg text-xs"
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
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-sm"
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
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                    <FiCheckCircle />
                                </span>
                                Your Applications
                            </h3>

                            {myApplications.length === 0 ? (
                                <p className="text-sm text-gray-400">You haven't submitted any job applications yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map(app => (
                                        <div key={app._id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                            <h4 className="font-bold text-sm text-gray-800">{app.jobId?.title || "Unknown Job"}</h4>
                                            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <FiFileText size={12} />
                                                    {app.resumeId?.fileName || "Resume"}
                                                </span>
                                                <span className="capitalize font-semibold text-blue-600 bg-blue-50/60 px-2 py-0.5 rounded-md">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-50 rounded-lg"
                                >
                                    <FiXCircle size={20} />
                                </button>
                            </div>

                            {resumes.length === 0 ? (
                                <div className="py-4 text-center">
                                    <p className="text-sm text-gray-600">You must upload a resume before you can apply to jobs.</p>
                                    <button
                                        onClick={() => window.location.href = "/upload-resume"}
                                        className="mt-4 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                                    >
                                        Upload Resume
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Resume</label>
                                        <select
                                            value={selectedResumeId}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                        >
                                            <option value="">Choose an uploaded resume...</option>
                                            {resumes.map(res => (
                                                <option key={res._id} value={res._id}>
                                                    {res.fileName} (ATS: {res.extractedData?.skills?.length || 0} skills)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setSelectedJob(null)}
                                            className="border border-gray-250 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApply}
                                            disabled={submitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            <FiSend size={14} />
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
