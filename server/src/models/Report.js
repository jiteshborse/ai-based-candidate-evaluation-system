const mongoose = require("mongoose");

const reportSchema =
    new mongoose.Schema(
        {
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "JobDescription",
                required: true
            },

            generatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            reportUrl: {
                type: String,
                required: true
            },

            summary: {
                type: String,
                default: ""
            }
        },
        {
            timestamps: true
        }
    );

module.exports = mongoose.model(
    "Report",
    reportSchema
);