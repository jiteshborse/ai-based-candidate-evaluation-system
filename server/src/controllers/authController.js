const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                name,
                email,
                password: hashedPassword,
                role
            });

        if (role === "candidate") {
            await Candidate.create({
                userId: user._id
            });
        } else if (role === "recruiter") {
            await Recruiter.create({
                userId: user._id,
                companyName: name || email.split("@")[0] || "Recruiter"
            });
        }

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token =
            generateToken(
                user._id,
                user.role
            );

        res.json({
            success: true,
            token,
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const crypto = require("crypto");
        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        console.log("=========================================");
        console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
        console.log(`RESET LINK: ${resetUrl}`);
        console.log("=========================================");

        res.status(200).json({
            success: true,
            message: "Reset link generated. (Simulated & printed to backend terminal)",
            token: resetToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const crypto = require("crypto");
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful! You can now log in."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};