const axios =
    require("axios");

exports.getRecommendation =
    async (
        finalScore,
        atsScore,
        skillMatch,
        experienceScore
    ) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/recommendation`,

                {
                    finalScore,
                    atsScore,
                    skillMatch,
                    experienceScore
                }
            );

        return response.data;
    };