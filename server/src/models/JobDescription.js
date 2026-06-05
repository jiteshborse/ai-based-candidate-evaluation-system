const mongoose = require("mongoose");

const jobDescriptionSchema =
    new mongoose.Schema(
        {
            recruiterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Recruiter",
                required: true
            },

            title: {
                type: String,
                required: true
            },

            description: {
                type: String,
                required: true
            },

            requiredSkills: [
                {
                    type: String
                }
            ],

            preferredSkills: [
                {
                    type: String
                }
            ],

            experienceMin: {
                type: Number,
                default: 0
            },

            educationLevel: {
                type: String,
                default: ""
            },

            keywords: [
                {
                    type: String
                }
            ],

            status: {
                type: String,
                enum: [
                    "open",
                    "closed"
                ],
                default: "open"
            }
        },
        {
            timestamps: true
        }
    );

jobDescriptionSchema.index({
    title: "text",
    description: "text"
});

module.exports = mongoose.model(
    "JobDescription",
    jobDescriptionSchema
);