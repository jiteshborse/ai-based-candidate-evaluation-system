import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getReports, generateReport, deleteReport } from "../../services/reportService";
import { getJobs } from "../../services/jobService";
import toast from "react-hot-toast";
import axios from "axios";
import { FiFileText, FiPlus, FiCalendar, FiDownload, FiCheckCircle, FiTrash2 } from "react-icons/fi";

function Reports() {
    const [reports, setReports] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reportToDelete, setReportToDelete] = useState(null);

    const fetchReports = async () => {
        try {
            const data = await getReports();
            setReports(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchReports(), loadJobs()]);
            setLoading(false);
        };
        init();
    }, []);

    const handleGenerate = async () => {
        if (!selectedJobId) {
            toast.error("Please select a job posting to generate ranking report.");
            return;
        }

        try {
            setGenerating(true);
            await generateReport({
                jobId: selectedJobId
            });

            toast.success("Ranking PDF report generated successfully!");
            setSelectedJobId("");
            fetchReports();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate report.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (reportId, summaryText) => {
        try {
            const token = localStorage.getItem("token");
            const filename = summaryText ? `${summaryText.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf` : "report.pdf";

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/reports/download/${reportId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download started!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download PDF file.");
        }
    };

    const confirmDelete = async () => {
        if (!reportToDelete) return;

        try {
            await deleteReport(reportToDelete._id);
            toast.success("Report deleted successfully");
            setReportToDelete(null);
            fetchReports();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete report."
            );
            console.error(error);
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
                        <p className="text-zinc-500 font-medium animate-pulse text-sm">Loading reports dashboard...</p>
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
                        <FiFileText className="text-indigo-400" /> Evaluation Reports
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Generate and download official PDF candidate evaluation reports.</p>
                </div>

                {/* Generator Section */}
                <div className="glass-card rounded-2xl shadow-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <FiPlus />
                        </span>
                        Generate New Report
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="flex-grow bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-350 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                        >
                            <option value="" className="bg-zinc-950 text-zinc-350">Select job posting requirements...</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id} className="bg-zinc-950 text-zinc-300">
                                    {job.title} ({job.requiredSkills?.slice(0, 3).join(", ")}...)
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleGenerate}
                            disabled={generating || !selectedJobId}
                            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        >
                            {generating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Compiling PDF...
                                </>
                            ) : "Generate PDF"}
                        </button>
                    </div>
                </div>

                {/* Reports Grid */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2 font-display">
                        Available PDF Downloads ({reports.length})
                    </h3>

                    {reports.length === 0 ? (
                        <div className="glass-card rounded-2xl p-8 text-center text-zinc-550 shadow-xl">
                            <p className="font-semibold text-zinc-350">No reports generated yet</p>
                            <p className="text-xs text-zinc-500 mt-1">Select a job posting above to compile your first PDF evaluation report.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {reports.map((report) => (
                                <div
                                    key={report._id}
                                    className="glass-card p-6 rounded-2xl shadow-xl flex flex-col justify-between border border-zinc-900/60 hover:border-indigo-500/10 transition-all duration-300"
                                >
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                                                <FiCheckCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white leading-tight font-display text-md">
                                                    {report.summary || "Candidate Evaluation Report"}
                                                </h4>
                                                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-light">
                                                    <FiCalendar /> Compiled: {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-xs text-zinc-400 space-y-1.5 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/40 font-light">
                                            <p className="truncate"><strong>Job ID:</strong> {report.jobId?._id || "N/A"}</p>
                                            <p><strong>Compiled By:</strong> {report.generatedBy?.name || "System"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-zinc-900/60 pt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => setReportToDelete(report)}
                                            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                                            title="Delete report"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                        <button
                                            onClick={() => handleDownload(report._id, report.summary)}
                                            className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                                        >
                                            <FiDownload /> Download PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {reportToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
                    <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-800/80 animate-fade-in">
                        <h3 className="text-xl font-bold text-white font-display mb-2">Delete Evaluation Report</h3>
                        <p className="text-sm text-zinc-400 font-light mb-6 leading-relaxed">
                            Are you sure you want to delete <span className="text-indigo-400 font-semibold">"{reportToDelete.summary || "this report"}"</span>? This will permanently erase the record and the associated PDF file from the server.
                        </p>
                        <div className="flex justify-end gap-3 border-t border-zinc-900/60 pt-4">
                            <button
                                onClick={() => setReportToDelete(null)}
                                className="border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                                <FiTrash2 size={12} /> Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Reports;