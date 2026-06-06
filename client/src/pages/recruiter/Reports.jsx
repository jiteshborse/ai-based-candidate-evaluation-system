import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    getReports,
    generateReport
} from "../../services/reportService";

import toast from "react-hot-toast";

function Reports() {

    const [reports, setReports] =
        useState([]);

    const fetchReports = async () => {
        try {
            const data = await getReports();
            setReports(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerate =
        async () => {

            try {

                await generateReport({
                    reportType: "ranking"
                });

                toast.success("Success");

                fetchReports();

            } catch (error) {

                console.error(error);
            }
        };

    return (

        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">

                    Reports

                </h1>

                <button
                    onClick={handleGenerate}
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >

                    Generate Report

                </button>

            </div>

            <div className="space-y-4">

                {
                    reports.map(report => (

                        <div
                            key={report._id}
                            className="bg-white p-5 rounded shadow"
                        >

                            <h2 className="font-bold text-lg">

                                {report.reportName}

                            </h2>

                            <p>

                                Type:
                                {" "}
                                {report.reportType}

                            </p>

                            <p>

                                Created:
                                {" "}
                                {
                                    new Date(
                                        report.createdAt
                                    ).toLocaleDateString()
                                }

                            </p>

                            <a

                                href={report.fileUrl}

                                target="_blank"

                                rel="noreferrer"

                                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded"

                            >

                                Download PDF

                            </a>

                        </div>

                    ))
                }

            </div>

        </DashboardLayout>
    );
}

export default Reports;