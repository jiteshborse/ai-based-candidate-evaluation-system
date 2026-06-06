import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createJob, getJobs, deleteJob } from "../../services/jobService";
import toast from "react-hot-toast";
import { FiBriefcase, FiTrash2, FiPlus, FiBookOpen, FiAward } from "react-icons/fi";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "",
        experienceMin: "",
        educationLevel: ""
    });

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.requiredSkills) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await createJob({
                title: formData.title,
                description: formData.description,
                experienceMin: Number(formData.experienceMin) || 0,
                educationLevel: formData.educationLevel || "",
                requiredSkills: formData.requiredSkills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean)
            });

            toast.success("Job Description created successfully!");
            setFormData({
                title: "",
                description: "",
                requiredSkills: "",
                experienceMin: "",
                educationLevel: ""
            });
            fetchJobs();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create job."
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteJob(id);
            toast.success("Job deleted successfully");
            fetchJobs();
        } catch (error) {
            toast.error("Failed to delete job.");
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <FiBriefcase className="text-blue-600" /> Job Management
                        </h1>
                        <p className="text-gray-500 mt-1">Create and manage job requirements for candidate evaluation.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Job Creator Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                    <FiPlus />
                                </span>
                                Create Job Posting
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior React Developer"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Outline core responsibilities and team role..."
                                        rows={4}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills *</label>
                                    <input
                                        type="text"
                                        name="requiredSkills"
                                        value={formData.requiredSkills}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Node.js, TypeScript"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Min Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experienceMin"
                                            value={formData.experienceMin}
                                            onChange={handleChange}
                                            placeholder="e.g. 3"
                                            min="0"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Education Level</label>
                                        <select
                                            name="educationLevel"
                                            value={formData.educationLevel}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                        >
                                            <option value="">Any Education</option>
                                            <option value="B.TECH">B.Tech</option>
                                            <option value="M.TECH">M.Tech</option>
                                            <option value="BCA">BCA</option>
                                            <option value="MCA">MCA</option>
                                            <option value="BSC">B.Sc</option>
                                            <option value="MSC">M.Sc</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    Publish Job Description
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
                            Active Postings ({jobs.length})
                        </h2>

                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                                <p className="font-semibold text-gray-700">No jobs posted yet</p>
                                <p className="text-sm text-gray-400 mt-1">Fill out the creator form to publish your first posting.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-1 gap-4">
                                {jobs.map(job => (
                                    <div
                                        key={job._id}
                                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete posting"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg">
                                                    <FiAward className="text-blue-500" />
                                                    Exp: {job.experienceMin || 0}+ Years
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg">
                                                    <FiBookOpen className="text-indigo-500" />
                                                    Edu: {job.educationLevel || "Any"}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Core Skills</p>
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Jobs;