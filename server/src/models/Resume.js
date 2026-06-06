const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
        },

        fileType: {
            type: String
        },

        fileName: {
            type: String,
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        rawText: {
            type: String,
            default: ""
        },

        extractedData: {

            name: String,

            email: String,

            phone: String,

            location: String,

            skills: [String],

            education: [String],

            projects: [String],

            certifications: [String],

            keywords: [String],

            experience: {
                type: Number,
                default: 0
            }
        },

        aiStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

resumeSchema.index({ candidateId: 1 });

module.exports = mongoose.model(
    "Resume",
    resumeSchema
);