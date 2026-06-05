const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
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

            skills: [String],

            education: [
                {
                    degree: String,
                    institution: String,
                    year: Number
                }
            ],

            experience: [
                {
                    company: String,
                    role: String,
                    duration: String
                }
            ],

            keywords: [String]
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