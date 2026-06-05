const Report =
    require("../models/Report");

const Ranking =
    require("../models/Ranking");

const JobDescription =
    require("../models/JobDescription");

const reportService =
    require("../services/reportService");

exports.generateReport =
    async (req, res) => {

        try {

            const { jobId } = req.body;

            const job =
                await JobDescription.findById(
                    jobId
                );

            if (!job) {

                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            const rankings =
                await Ranking.find({
                    jobId
                })
                    .sort({
                        rank: 1
                    });

            const reportPath =
                await reportService.generatePDF(
                    job,
                    rankings
                );

            const report =
                await Report.create({

                    jobId,

                    generatedBy:
                        req.user.id,

                    reportUrl:
                        reportPath,

                    summary:
                        `Ranking report for ${job.title}`

                });

            res.status(201).json({

                success: true,

                data: report

            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

exports.getReports =
    async (req, res) => {

        try {

            const reports =
                await Report.find()
                    .populate("jobId")
                    .populate("generatedBy");

            res.status(200).json({
                success: true,
                data: reports
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

exports.downloadReport =
    async (req, res) => {

        try {

            const report =
                await Report.findById(
                    req.params.id
                );

            if (!report) {

                return res.status(404).json({
                    message: "Report not found"
                });
            }

            res.download(
                report.reportUrl
            );

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

