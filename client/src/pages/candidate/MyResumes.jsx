import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getResumes, deleteResume } from "../../services/resumeService";
import toast from "react-hot-toast";
import { FiFileText, FiTrash2, FiCalendar, FiMapPin, FiMail, FiPhone, FiBook, FiAward, FiList } from "react-icons/fi";

function MyResumes() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadResumes = async () => {
        try {
            setLoading(true);
            const response = await getResumes();
            setResumes(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load resumes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResumes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resume?")) {
            return;
        }

        try {
            await deleteResume(id);
            toast.success("Resume deleted successfully");
            loadResumes();
        } catch (error) {
            toast.error("Failed to delete resume.");
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
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Retrieving your resumes...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiFileText className="text-indigo-400" /> My Resumes
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">View and manage your uploaded resumes parsed by our AI models.</p>
                </div>

                {resumes.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 text-center text-zinc-500 shadow-xl space-y-4">
                        <FiList className="w-8 h-8 text-zinc-650 mx-auto" />
                        <p className="font-semibold text-zinc-350">No resumes uploaded yet</p>
                        <p className="text-xs text-zinc-500">Head over to the "Upload Resume" page to get started.</p>
                        <button
                            onClick={() => window.location.href = "/upload-resume"}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Upload Resume
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {resumes.map((resume) => {
                            const data = resume.extractedData || {};
                            return (
                                <div
                                    key={resume._id}
                                    className="glass-card p-6 rounded-2xl shadow-xl flex flex-col justify-between border border-zinc-900/60 relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300"
                                >
                                    {/* Top row actions */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900/60 pb-5 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shadow-inner group-hover:bg-indigo-500/15 transition-all">
                                                <FiFileText size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white font-display text-md group-hover:text-indigo-400 transition-colors">{resume.fileName}</h3>
                                                <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 font-light">
                                                    <FiCalendar /> Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end md:self-center">
                                            <button
                                                onClick={() => handleDelete(resume._id)}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                                                title="Delete Resume"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Extracted Data Visualizer */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        
                                        {/* Contact & Meta */}
                                        <div className="space-y-3.5 text-zinc-300 border-r border-zinc-900/60 pr-4 font-light text-xs">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Parsed Profile</h4>
                                            {data.name && <p className="font-bold text-white text-sm font-display mb-2">{data.name}</p>}
                                            {data.email && (
                                                <p className="flex items-center gap-2">
                                                    <FiMail className="text-zinc-550 flex-shrink-0" /> {data.email}
                                                </p>
                                            )}
                                            {data.phone && (
                                                <p className="flex items-center gap-2">
                                                    <FiPhone className="text-zinc-550 flex-shrink-0" /> {data.phone}
                                                </p>
                                            )}
                                            {data.location && (
                                                <p className="flex items-center gap-2">
                                                    <FiMapPin className="text-zinc-550 flex-shrink-0" /> {data.location}
                                                </p>
                                            )}
                                        </div>

                                        {/* Core Details */}
                                        <div className="space-y-4 text-zinc-300 border-r border-zinc-900/60 px-2 md:px-4 font-light text-xs">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Qualifications</h4>
                                            <div className="flex items-center gap-2 text-zinc-200">
                                                <FiAward className="text-indigo-400 shrink-0" />
                                                <span>
                                                    Experience detected: <strong className="font-bold text-white font-display text-sm">{data.experience || 0}</strong> Years
                                                </span>
                                            </div>
                                            {data.education && data.education.length > 0 && (
                                                <div className="flex items-start gap-2">
                                                    <FiBook className="text-purple-400 mt-0.5 shrink-0" />
                                                    <div className="space-y-2">
                                                        <span>Education:</span>
                                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                            {data.education.map((edu, idx) => (
                                                                <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-medium">
                                                                    {edu}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills Tag Cloud */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Extracted Skills ({data.skills?.length || 0})</h4>
                                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                                                {data.skills && data.skills.length > 0 ? (
                                                    data.skills.map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-zinc-900/60 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/20 px-2.5 py-0.5 rounded text-[10px] text-zinc-400 hover:text-indigo-400 transition-all duration-200 font-medium capitalize cursor-pointer"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-zinc-550 italic font-light">No skills extracted</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyResumes;