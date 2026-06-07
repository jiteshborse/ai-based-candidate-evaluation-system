const mongoose = require("mongoose");

const rankingSchema =
    new mongoose.Schema(
        {
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "JobDescription",
                required: true
            },

            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Candidate",
                required: true
            },

            recommendationData: {

                recommendation: String,

                confidence: Number,

                decision: String,

                reasons: [String]
            },

            explanation: {

                strengths: [String],

                weaknesses: [String],

                recommendationReason: String,

                scoreBreakdown: {

                    skillContribution: Number,

                    experienceContribution: Number,

                    educationContribution: Number,

                    keywordContribution: Number
                }
            },

            atsAnalysis: {

                atsScore: Number,

                grade: String,

                atsStatus: String,

                breakdown: Object
            },

            resumeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resume",
                required: true
            },

            skillScore: {
                type: Number,
                default: 0
            },

            experienceScore: {
                type: Number,
                default: 0
            },

            educationScore: {
                type: Number,
                default: 0
            },

            keywordSimilarity: {
                type: Number,
                default: 0
            },

            finalScore: {
                type: Number,
                default: 0
            },

            rank: {
                type: Number,
                default: 0
            },

            recommendation: {
                type: String,
                enum: [
                    "Strong Hire",
                    "Highly Recommended",
                    "Recommended",
                    "Average Match",
                    "Average",
                    "Not Recommended"
                ],
                default: "Average"
            }
        },
        {
            timestamps: true
        }
    );

rankingSchema.index({
    jobId: 1,
    finalScore: -1
});

module.exports = mongoose.model(
    "Ranking",
    rankingSchema
);