const Resume = require("../models/Resume");
const Candidate = require("../models/Candidate");
const aiService = require("../services/aiService");

exports.uploadResume = async (req, res) => {

    try {

        const candidate =
            await Candidate.findOne({
                userId: req.user.id
            });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file required"
            });
        }

        const resume =
            await Resume.create({

                candidateId:
                    candidate._id,

                fileName:
                    req.file.filename,

                fileUrl:
                    req.file.path,

                aiStatus:
                    "pending"
            });

        const aiData =
            await aiService.parseResume(
                req.file.path
            );

        resume.rawText =
            aiData.rawText;

        resume.extractedData = {

            name: aiData.name,

            email: aiData.email,

            phone: aiData.phone,

            location: aiData.location,

            skills: aiData.skills,

            education: aiData.education,

            projects: aiData.projects,

            certifications: aiData.certifications,

            keywords: aiData.keywords
        };

        resume.aiStatus =
            "completed";

        await resume.save();

        res.status(201).json({
            success: true,
            data: resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getResume = async (req, res) => {

    try {

        const resume =
            await Resume.findById(
                req.params.id
            );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.status(200).json({
            success: true,
            data: resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteResume = async (req, res) => {

    try {

        const resume =
            await Resume.findById(
                req.params.id
            );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Resume deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};