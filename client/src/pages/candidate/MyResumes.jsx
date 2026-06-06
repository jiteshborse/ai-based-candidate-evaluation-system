import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getResumes, deleteResume } from "../../services/resumeService";
import toast from "react-hot-toast";
import { FiFileText, FiTrash2, FiCalendar, FiMapPin, FiMail, FiPhone, FiBook, FiAward, FiSettings } from "react-icons/fi";

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
                    <p className="text-gray-500 font-semibold animate-pulse text-lg">Retrieving your resumes...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <FiFileText className="text-blue-600" /> My Resumes
                    </h1>
                    <p className="text-gray-500 mt-1">View and manage your uploaded resumes parsed by our AI models.</p>
                </div>

                {resumes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                        <p className="font-semibold text-gray-700">No resumes uploaded yet</p>
                        <p className="text-sm text-gray-400 mt-1">Head over to the "Upload Resume" page to get started.</p>
                        <button
                            onClick={() => window.location.href = "/upload-resume"}
                            className="mt-4 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
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
                                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                                <FiFileText size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{resume.fileName}</h3>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <FiCalendar /> Uploaded on: {new Date(resume.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end md:self-center">
                                            <button
                                                onClick={() => handleDelete(resume._id)}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3.5 py-2 rounded-xl transition-all"
                                                title="Delete Resume"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Extracted Data Visualizer */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Contact & Meta */}
                                        <div className="space-y-2.5 text-sm text-gray-600 border-r border-gray-50 pr-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Parsed Profile</h4>
                                            {data.name && <p className="font-bold text-gray-900">{data.name}</p>}
                                            {data.email && (
                                                <p className="flex items-center gap-2 text-xs">
                                                    <FiMail className="text-gray-400 flex-shrink-0" /> {data.email}
                                                </p>
                                            )}
                                            {data.phone && (
                                                <p className="flex items-center gap-2 text-xs">
                                                    <FiPhone className="text-gray-400 flex-shrink-0" /> {data.phone}
                                                </p>
                                            )}
                                            {data.location && (
                                                <p className="flex items-center gap-2 text-xs">
                                                    <FiMapPin className="text-gray-400 flex-shrink-0" /> {data.location}
                                                </p>
                                            )}
                                        </div>

                                        {/* Core Details */}
                                        <div className="space-y-3 text-sm text-gray-600 border-r border-gray-50 px-2 md:px-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Qualifications</h4>
                                            <div className="flex items-center gap-2">
                                                <FiAward className="text-blue-500" />
                                                <span className="font-medium text-gray-800">
                                                    Exp detected: {data.experience || 0} Years
                                                </span>
                                            </div>
                                            {data.education && data.education.length > 0 && (
                                                <div className="flex items-start gap-2">
                                                    <FiBook className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-gray-800">Education:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {data.education.map((edu, idx) => (
                                                                <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md font-medium">
                                                                    {edu}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills Tag Cloud */}
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Extracted Skills ({data.skills?.length || 0})</h4>
                                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                                                {data.skills && data.skills.length > 0 ? (
                                                    data.skills.map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-100 hover:text-blue-600 px-2 py-0.5 rounded-md text-xs text-gray-700 transition-all font-medium capitalize"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No skills extracted</span>
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