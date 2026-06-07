import { useState, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { uploadResume } from "../../services/resumeService";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFileText, FiXCircle } from "react-icons/fi";

function UploadResume() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleClearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("resume", file);

            await uploadResume(formData);
            toast.success("Resume uploaded and parsed successfully!");
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to upload resume."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiUploadCloud className="text-indigo-400" /> Upload Resume
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Submit your resume for semantic parsing and AI match rating.</p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                    
                    {/* Drag and Drop Zone */}
                    <div
                        onClick={triggerFileInput}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${
                            file 
                                ? "border-indigo-500 bg-indigo-500/5" 
                                : "border-zinc-800 bg-zinc-950/20 hover:border-indigo-500/40 hover:bg-zinc-900/30"
                        }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {file ? (
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-450 flex items-center justify-center border border-indigo-500/20">
                                    <FiFileText size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{file.name}</p>
                                    <p className="text-xs text-zinc-550 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClearFile}
                                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    <FiXCircle /> Remove selected file
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-zinc-900 text-zinc-400 flex items-center justify-center border border-zinc-800 group-hover:border-indigo-500/35 group-hover:text-indigo-400 transition-all duration-300">
                                    <FiUploadCloud size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-200">
                                        Drag & drop your file here, or <span className="text-indigo-400 group-hover:underline">browse</span>
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1.5">Supports PDF, DOCX, TXT formats up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Submit Button */}
                    <div className="flex justify-end pt-2 border-t border-zinc-900/60">
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                        >
                            <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl"></span>
                            <span className="relative flex items-center justify-center px-6 py-3 rounded-[11px] bg-zinc-950 font-semibold text-white transition-colors duration-200 group-hover:bg-zinc-900/50">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Parsing Resume...
                                    </span>
                                ) : (
                                    "Upload & Parse Resume"
                                )}
                            </span>
                        </button>
                    </div>

                </form>

            </div>
        </DashboardLayout>
    );
}

export default UploadResume;