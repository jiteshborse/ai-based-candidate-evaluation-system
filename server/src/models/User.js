const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "recruiter", "candidate"],
            default: "candidate"
        },

        status: {
            type: String,
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);