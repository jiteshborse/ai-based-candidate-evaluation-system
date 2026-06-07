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
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiBriefcase className="text-indigo-400" /> Job Management
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Create and manage job requirements for candidate evaluation.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Job Creator Form */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl shadow-xl p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 font-display">
                                <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <FiPlus />
                                </span>
                                Create Job Posting
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior React Developer"
                                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Job Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Outline core responsibilities and team role..."
                                        rows={4}
                                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Required Skills *</label>
                                    <input
                                        type="text"
                                        name="requiredSkills"
                                        value={formData.requiredSkills}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Node.js, TypeScript"
                                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                        required
                                    />
                                    <p className="text-[10px] text-zinc-500">Separate skills with commas</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Min Exp (Years)</label>
                                        <input
                                            type="number"
                                            name="experienceMin"
                                            value={formData.experienceMin}
                                            onChange={handleChange}
                                            placeholder="e.g. 3"
                                            min="0"
                                            className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-655 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">Education Level</label>
                                        <select
                                            name="educationLevel"
                                            value={formData.educationLevel}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                        >
                                            <option value="" className="bg-zinc-950 text-zinc-300">Any Education</option>
                                            <option value="B.TECH" className="bg-zinc-950 text-zinc-300">B.Tech</option>
                                            <option value="M.TECH" className="bg-zinc-950 text-zinc-300">M.Tech</option>
                                            <option value="BCA" className="bg-zinc-950 text-zinc-300">BCA</option>
                                            <option value="MCA" className="bg-zinc-950 text-zinc-300">MCA</option>
                                            <option value="BSC" className="bg-zinc-950 text-zinc-300">B.Sc</option>
                                            <option value="MSC" className="bg-zinc-950 text-zinc-300">M.Sc</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none mt-4 cursor-pointer"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl"></span>
                                    <span className="relative flex items-center justify-center px-5 py-3 rounded-[11px] bg-zinc-950 font-semibold text-white transition-colors duration-200 group-hover:bg-zinc-900/50">
                                        Publish Job Description
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                            Active Postings ({jobs.length})
                        </h2>

                        {jobs.length === 0 ? (
                            <div className="glass-card rounded-2xl p-8 text-center text-zinc-500 shadow-xl">
                                <p className="font-semibold text-zinc-350">No jobs posted yet</p>
                                <p className="text-xs text-zinc-500 mt-1">Fill out the creator form to publish your first posting.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-1 gap-4">
                                {jobs.map(job => (
                                    <div
                                        key={job._id}
                                        className="glass-card p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white font-display group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all cursor-pointer"
                                                    title="Delete posting"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>

                                            <p className="text-zinc-400 text-sm mt-3 line-clamp-3 leading-relaxed font-light">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-4 text-xs">
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-400">
                                                    <FiAward className="text-indigo-400" />
                                                    Exp: {job.experienceMin || 0}+ Years
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-400">
                                                    <FiBookOpen className="text-purple-400" />
                                                    Edu: {job.educationLevel || "Any"}
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Required Core Skills</p>
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