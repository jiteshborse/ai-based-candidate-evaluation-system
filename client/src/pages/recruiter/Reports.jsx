import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getReports, generateReport } from "../../services/reportService";
import { getJobs } from "../../services/jobService";
import toast from "react-hot-toast";
import axios from "axios";
import { FiFileText, FiPlus, FiCalendar, FiDownload, FiCheckCircle } from "react-icons/fi";

function Reports() {
    const [reports, setReports] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500 font-semibold animate-pulse text-lg">Loading reports dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <FiFileText className="text-blue-600" /> Evaluation Reports
                        </h1>
                        <p className="text-gray-500 mt-1">Generate and download official PDF candidate evaluation reports.</p>
                    </div>
                </div>

                {/* Generator Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <FiPlus />
                        </span>
                        Generate New Report
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        >
                            <option value="">Select job posting requirements...</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.title} ({job.requiredSkills?.slice(0, 3).join(", ")}...)
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {generating ? "Generating PDF..." : "Generate PDF"}
                        </button>
                    </div>
                </div>

                {/* Reports Grid */}
                <h3 className="text-xl font-bold text-gray-950 mb-4 flex items-center gap-2">
                    Available PDF Downloads ({reports.length})
                </h3>

                {reports.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                        <p className="font-semibold text-gray-700">No reports generated yet</p>
                        <p className="text-sm text-gray-400 mt-1">Select a job posting above to compile your first PDF evaluation report.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {reports.map((report) => (
                            <div
                                key={report._id}
                                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                                            <FiCheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">
                                                {report.summary || "Candidate Evaluation Report"}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                <FiCalendar /> Compiled: {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                                        <p><strong>Associated Job ID:</strong> {report.jobId?._id || "N/A"}</p>
                                        <p><strong>Compiled By:</strong> {report.generatedBy?.name || "System"}</p>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-gray-50 pt-4 flex justify-end">
                                    <button
                                        onClick={() => handleDownload(report._id, report.summary)}
                                        className="flex items-center justify-center gap-1.5 text-xs font-bold bg-green-50 hover:bg-green-100 text-green-700 border border-green-150 px-4 py-2 rounded-xl transition-all shadow-sm"
                                    >
                                        <FiDownload /> Download PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Reports;