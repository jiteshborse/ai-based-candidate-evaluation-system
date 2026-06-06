const User = require("../models/User");
const Candidate = require("../models/Candidate");
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