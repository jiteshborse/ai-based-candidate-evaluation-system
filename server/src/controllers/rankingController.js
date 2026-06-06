const Ranking = require("../models/Ranking");
const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Application = require("../models/Application");
const rankingService = require("../services/rankingService");
const skillGapService = require("../services/skillGapService");
const recommendationService = require("../services/recommendationService");
const explainabilityService = require("../services/explainabilityService");
const atsService = require("../services/atsService");

function calculateSkillScore(candidateSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 0;
    const matches = candidateSkills.filter(skill =>
        requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
    return (matches.length / requiredSkills.length) * 100;
}

function calculateExperienceScore(candidateYears, requiredYears) {
    if (!requiredYears || requiredYears === 0) return 100;
    return Math.min((candidateYears / requiredYears) * 100, 100);
}

function calculateEducationScore(candidateEducation, requiredEducation) {
    if (!requiredEducation) return 100;
    const educationText = JSON.stringify(candidateEducation || []).toLowerCase();
    if (educationText.includes(requiredEducation.toLowerCase())) {
        return 100;
    }
    return 0;
}

exports.generateRanking = async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await JobDescription.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const applications = await Application.find({ jobId }).populate("resumeId");
        const rankingResults = [];

        for (const application of applications) {
            const resume = application.resumeId;
            if (!resume) continue;

            const candidateSkills = resume.extractedData?.skills || [];
            const requiredSkills = job.requiredSkills || [];

            const skillScore = calculateSkillScore(candidateSkills, requiredSkills);
            const candidateYears = resume.extractedData?.experience || 0;
            const experienceScore = calculateExperienceScore(candidateYears, job.experienceMin);

            const educationScore = calculateEducationScore(
                resume.extractedData?.education || [],
                job.educationLevel
            );

            const similarity = await rankingService.getKeywordSimilarity(
                resume.rawText || "",
                job.description || ""
            );

            const finalScore =
                (skillScore * 0.40) +
                (experienceScore * 0.25) +
                (educationScore * 0.15) +
                (similarity * 0.20);

            // Fetch skill gap details
            const skillGap = await skillGapService.analyzeSkillGap(
                candidateSkills,
                requiredSkills
            );

            // Detect sections found in resume
            const sectionsFound = [];
            if (resume.extractedData?.skills?.length > 0) sectionsFound.push("skills");
            if (resume.extractedData?.education?.length > 0) sectionsFound.push("education");
            if (resume.extractedData?.experience > 0) sectionsFound.push("experience");
            if (resume.extractedData?.projects?.length > 0) sectionsFound.push("projects");
            if (resume.extractedData?.certifications?.length > 0) sectionsFound.push("certifications");

            const matchedSkills = candidateSkills.filter(skill =>
                requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
            );

            // Fetch ATS score
            const atsData = await atsService.getATSScore({
                sectionsFound,
                matchedSkills,
                requiredSkills,
                keywordSimilarity: similarity,
                experienceMatch: experienceScore,
                educationMatch: educationScore,
                projectsCount: resume.extractedData?.projects?.length || 0,
                certificationsCount: resume.extractedData?.certifications?.length || 0
            });

            // Fetch AI Recommendation
            const recData = await recommendationService.getRecommendation(
                finalScore,
                atsData.atsScore || 0,
                skillGap.matchPercentage || 0,
                experienceScore
            );

            // Fetch AI Explanation
            const expData = await explainabilityService.getExplanation({
                skillScore,
                experienceScore,
                educationScore,
                keywordSimilarity: similarity,
                atsScore: atsData.atsScore || 0,
                finalScore,
                missingSkills: skillGap.missingSkills || []
            });

            rankingResults.push({
                candidateId: application.candidateId,
                resumeId: resume._id,
                skillScore,
                experienceScore,
                educationScore,
                keywordSimilarity: similarity,
                finalScore: Number(finalScore.toFixed(2)),
                atsAnalysis: {
                    atsScore: atsData.atsScore,
                    grade: atsData.grade,
                    atsStatus: atsData.atsStatus,
                    breakdown: atsData.breakdown
                },
                recommendationData: {
                    recommendation: recData.recommendation,
                    confidence: recData.confidence,
                    decision: recData.decision,
                    reasons: recData.reasons
                },
                explanation: {
                    strengths: expData.strengths,
                    weaknesses: expData.weaknesses,
                    recommendationReason: expData.recommendationReason,
                    scoreBreakdown: {
                        skillContribution: expData.scoreBreakdown?.skillContribution || 0,
                        experienceContribution: expData.scoreBreakdown?.experienceContribution || 0,
                        educationContribution: expData.scoreBreakdown?.educationContribution || 0,
                        keywordContribution: expData.scoreBreakdown?.keywordContribution || 0
                    }
                },
                recommendation: recData.recommendation
            });
        }

        rankingResults.sort((a, b) => b.finalScore - a.finalScore);

        // Delete old rankings for this job first
        await Ranking.deleteMany({ jobId });

        // Save new rankings with sequential ranks
        for (let i = 0; i < rankingResults.length; i++) {
            rankingResults[i].rank = i + 1;
            await Ranking.create({
                jobId,
                ...rankingResults[i]
            });
        }

        res.status(200).json({
            success: true,
            data: rankingResults
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getRankings = async (req, res) => {
    try {
        const rankings = await Ranking.find({ jobId: req.params.jobId })
            .sort({ rank: 1 })
            .populate({
                path: "candidateId",
                populate: { path: "userId", select: "name email" }
            });

        res.status(200).json({
            success: true,
            data: rankings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
