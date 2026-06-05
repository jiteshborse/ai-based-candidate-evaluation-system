const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        phone: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        education: [
            {
                degree: String,
                institution: String,
                passingYear: Number,
                percentage: Number
            }
        ],

        skills: [
            {
                type: String
            }
        ],

        experienceYears: {
            type: Number,
            default: 0
        },

        profileSummary: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Candidate",
    candidateSchema
);