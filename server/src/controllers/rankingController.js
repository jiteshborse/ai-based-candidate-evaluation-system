const Ranking =
    require("../models/Ranking");

const Resume =
    require("../models/Resume");

const JobDescription =
    require("../models/JobDescription");

const Application =
    require("../models/Application");

const rankingService =
    require("../services/rankingService");

function calculateSkillScore(
    candidateSkills,
    requiredSkills
) {

    if (
        requiredSkills.length === 0
    ) return 0;

    const matches =
        candidateSkills.filter(
            skill =>
                requiredSkills.includes(skill)
        );

    return (
        matches.length /
        requiredSkills.length
    ) * 100;
}

function calculateExperienceScore(
    candidateYears,
    requiredYears
) {

    if (requiredYears === 0)
        return 100;

    return Math.min(
        (
            candidateYears /
            requiredYears
        ) * 100,
        100
    );
}

function calculateEducationScore(
    candidateEducation,
    requiredEducation
) {

    const educationText =
        JSON.stringify(
            candidateEducation
        ).toLowerCase();

    if (
        educationText.includes(
            requiredEducation.toLowerCase()
        )
    ) {
        return 100;
    }

    return 0;
}

exports.generateRanking =
    async (req, res) => {

        try {

            const { jobId } = req.body;

            const job =
                await JobDescription.findById(jobId);

            if (!job) {

                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            const applications =
                await Application.find({
                    jobId
                }).populate("resumeId");

            const rankingResults = [];

            for (
                const application
                of applications
            ) {

                const resume =
                    application.resumeId;

                const skillScore =
                    calculateSkillScore(
                        resume.extractedData.skills,
                        job.requiredSkills
                    );

                const candidateYears =
                    resume.extractedData
                        ?.experience?.[0]
                        ?.duration || 0;

                const experienceScore =
                    calculateExperienceScore(
                        candidateYears,
                        job.experienceMin
                    );

                const skillGap =
                    await skillGapService
                        .analyzeSkillGap(
                            resume.extractedData.skills,
                            job.requiredSkills
                        );

                const educationScore =
                    calculateEducationScore(
                        resume.extractedData.education,
                        job.educationLevel
                    );

                const similarity =
                    await rankingService
                        .getKeywordSimilarity(
                            resume.rawText,
                            job.description
                        );

                const finalScore =

                    (skillScore * 0.40)
                    +
                    (experienceScore * 0.25)
                    +
                    (educationScore * 0.15)
                    +
                    (similarity * 0.20);

                rankingResults.push({

                    candidateId:
                        application.candidateId,

                    resumeId:
                        resume._id,

                    skillScore,

                    experienceScore,

                    educationScore,

                    keywordSimilarity:
                        similarity,

                    finalScore:
                        Number(
                            finalScore.toFixed(2)
                        )
                });
            }

            rankingResults.sort(
                (a, b) =>
                    b.finalScore -
                    a.finalScore
            );

            for (
                let i = 0;
                i < rankingResults.length;
                i++
            ) {

                rankingResults[i].rank =
                    i + 1;

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

exports.getRankings =
    async (req, res) => {

        try {

            const rankings =
                await Ranking.find({
                    jobId: req.params.jobId
                })
                    .sort({
                        rank: 1
                    })
                    .populate("candidateId");

            res.status(200).json({
                success: true,
                data: rankings
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

