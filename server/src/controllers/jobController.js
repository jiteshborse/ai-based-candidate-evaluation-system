const JobDescription = require("../models/JobDescription");
const Recruiter = require("../models/Recruiter");
const User = require("../models/User");

const getOrCreateRecruiterProfile = async (userId, role) => {
    let recruiter = await Recruiter.findOne({
        userId
    });

    if (recruiter) {
        return recruiter;
    }

    const user = await User.findById(userId);

    if (!user) {
        return null;
    }

    recruiter = await Recruiter.create({
        userId: user._id,
        companyName: user.name || role || "Recruiter"
    });

    return recruiter;
};

exports.createJob = async (req, res) => {
    try {

        const recruiter = await getOrCreateRecruiterProfile(
            req.user.id,
            req.user.role
        );

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found"
            });
        }

        const job = await JobDescription.create({
            recruiterId: recruiter._id,
            ...req.body
        });

        res.status(201).json({
            success: true,
            data: job
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getAllJobs = async (req, res) => {
    try {

        const jobs = await JobDescription
            .find()
            .populate("recruiterId");

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getJobById = async (req, res) => {

    try {

        const job = await JobDescription
            .findById(req.params.id)
            .populate("recruiterId");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.updateJob = async (req, res) => {

    try {

        const job = await JobDescription.findById(
            req.params.id
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const recruiter = await getOrCreateRecruiterProfile(
            req.user.id,
            req.user.role
        );

        if (
            recruiter &&
            job.recruiterId.toString() !== recruiter._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const updatedJob =
            await JobDescription.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true
                }
            );

        res.status(200).json({
            success: true,
            data: updatedJob
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.deleteJob = async (req, res) => {

    try {

        const job =
            await JobDescription.findById(
                req.params.id
            );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const recruiter = await getOrCreateRecruiterProfile(
            req.user.id,
            req.user.role
        );

        if (
            recruiter &&
            job.recruiterId.toString() !== recruiter._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};