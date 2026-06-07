const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");
const Resume = require("../models/Resume");
const Application = require("../models/Application");
const JobDescription = require("../models/JobDescription");
const Ranking = require("../models/Ranking");

exports.getDashboardStats =
    async (req, res) => {

        try {

            const totalUsers =
                await User.countDocuments();

            const totalCandidates =
                await Candidate.countDocuments();

            const totalRecruiters =
                await Recruiter.countDocuments();

            const totalJobs =
                await JobDescription.countDocuments();

            const totalApplications =
                await Application.countDocuments();

            const totalResumes =
                await Resume.countDocuments();

            // Calculate ATS score distribution
            const rankings = await Ranking.find({}, "atsAnalysis.atsScore");
            const brackets = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "Under 60": 0 };
            rankings.forEach(r => {
                const score = r.atsAnalysis?.atsScore || 0;
                if (score >= 90) brackets["90-100"]++;
                else if (score >= 80) brackets["80-89"]++;
                else if (score >= 70) brackets["70-79"]++;
                else if (score >= 60) brackets["60-69"]++;
                else brackets["Under 60"]++;
            });
            const atsDistribution = Object.keys(brackets).map(range => ({ range, count: brackets[range] }));

            // Aggregate Top Skills from jobs
            const topSkillsRaw = await JobDescription.aggregate([
                { $unwind: "$requiredSkills" },
                { $group: { _id: "$requiredSkills", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 8 }
            ]);
            const topSkills = topSkillsRaw.map(item => ({ skill: item._id, count: item.count }));

            // Aggregate hiring recommendation stats
            const recStatsRaw = await Ranking.aggregate([
                { $group: { _id: "$recommendation", count: { $sum: 1 } } }
            ]);
            const recommendationStats = ["Strong Hire", "Highly Recommended", "Recommended", "Average Match", "Not Recommended"].map(name => {
                let count = 0;
                if (name === "Average Match") {
                    const match1 = recStatsRaw.find(item => item._id === "Average Match");
                    const match2 = recStatsRaw.find(item => item._id === "Average");
                    count = (match1 ? match1.count : 0) + (match2 ? match2.count : 0);
                } else {
                    const match = recStatsRaw.find(item => item._id === name);
                    count = match ? match.count : 0;
                }
                return { name, value: count };
            });

            res.status(200).json({

                success: true,

                data: {

                    totalUsers,

                    totalCandidates,

                    totalRecruiters,

                    totalJobs,

                    totalApplications,

                    totalResumes,

                    atsDistribution,

                    topSkills,

                    recommendationStats

                }

            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };

exports.getTopCandidates =
    async (req, res) => {

        try {

            const candidates =
                await Ranking.find()
                    .sort({
                        finalScore: -1
                    })
                    .limit(10)
                    .populate({
                        path: "candidateId"
                    });

            res.status(200).json({
                success: true,
                data: candidates
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

exports.getAverageScore =
    async (req, res) => {

        try {

            const result =
                await Ranking.aggregate([
                    {
                        $group: {
                            _id: null,
                            averageScore: {
                                $avg: "$finalScore"
                            }
                        }
                    }
                ]);

            res.status(200).json({
                success: true,
                averageScore:
                    result[0]?.averageScore || 0
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

exports.getTopSkills =
    async (req, res) => {

        try {

            const skills =
                await JobDescription.aggregate([

                    {
                        $unwind:
                            "$requiredSkills"
                    },

                    {
                        $group: {
                            _id: "$requiredSkills",
                            count: {
                                $sum: 1
                            }
                        }
                    },

                    {
                        $sort: {
                            count: -1
                        }
                    },

                    {
                        $limit: 10
                    }
                ]);

            res.status(200).json({
                success: true,
                data: skills
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

exports.getApplicationsPerJob =
    async (req, res) => {

        try {

            const stats =
                await Application.aggregate([

                    {
                        $group: {
                            _id: "$jobId",
                            totalApplications: {
                                $sum: 1
                            }
                        }
                    },

                    {
                        $sort: {
                            totalApplications: -1
                        }
                    }
                ]);

            res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

