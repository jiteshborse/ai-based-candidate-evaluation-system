const mongoose = require("mongoose");

const applicationSchema =
    new mongoose.Schema(
        {
            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Candidate",
                required: true
            },

            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "JobDescription",
                required: true
            },

            resumeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resume",
                required: true
            },

            status: {
                type: String,
                enum: [
                    "applied",
                    "shortlisted",
                    "interview",
                    "rejected",
                    "selected"
                ],
                default: "applied"
            }
        },
        {
            timestamps: true
        }
    );

applicationSchema.index({
    candidateId: 1,
    jobId: 1
},
    {
        unique: true
    });

module.exports = mongoose.model(
    "Application",
    applicationSchema
);