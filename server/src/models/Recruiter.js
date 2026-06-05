const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyName: {
            type: String,
            required: true
        },

        designation: {
            type: String,
            default: ""
        },

        department: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Recruiter",
    recruiterSchema
);