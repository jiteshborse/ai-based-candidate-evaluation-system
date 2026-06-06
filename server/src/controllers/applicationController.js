const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");

exports.applyJob = async (req, res) => {
    try {
        const { jobId, resumeId } = req.body;

        // Find candidate profile corresponding to logged-in candidate user
        const candidate = await Candidate.findOne({ userId: req.user.id });
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found. Please log in as a candidate."
            });
        }

        // Validate resume belongs to candidate
        const resume = await Resume.findOne({ _id: resumeId, candidateId: candidate._id });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found or does not belong to you."
            });
        }

        // Validate job exists
        const job = await JobDescription.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check duplicate application
        const existingApp = await Application.findOne({ candidateId: candidate._id, jobId });
        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this job."
            });
        }

        const application = await Application.create({
            candidateId: candidate._id,
            jobId,
            resumeId,
            status: "applied"
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.user.id });
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found."
            });
        }

        const applications = await Application.find({ candidateId: candidate._id })
            .populate("jobId")
            .populate("resumeId");

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId })
            .populate({
                path: "candidateId",
                populate: { path: "userId", select: "name email" }
            })
            .populate("resumeId");

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
