const mongoose = require("mongoose");

const modelPaths = [
    "../models/User",
    "../models/Recruiter",
    "../models/Candidate",
    "../models/JobDescription",
    "../models/Application",
    "../models/Resume",
    "../models/Ranking",
    "../models/Report"
];

const ensureIndexes = async () => {
    modelPaths.forEach((modelPath) => {
        require(modelPath);
    });

    const models = mongoose.modelNames();

    await Promise.all(
        models.map((modelName) => mongoose.model(modelName).createIndexes())
    );
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await ensureIndexes();

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;