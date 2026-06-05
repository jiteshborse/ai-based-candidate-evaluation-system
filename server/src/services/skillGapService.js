const axios =
    require("axios");

exports.analyzeSkillGap =
    async (
        candidateSkills,
        requiredSkills
    ) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/skill-gap-analysis`,

                {
                    candidateSkills,
                    requiredSkills
                }
            );

        return response.data;
    };