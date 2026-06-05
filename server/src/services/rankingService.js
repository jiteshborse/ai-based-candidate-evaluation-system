const axios = require("axios");

exports.getKeywordSimilarity =
    async (
        resumeText,
        jobText
    ) => {

        const response =
            await axios.post(
                `${process.env.AI_SERVICE_URL}/rank-candidate`,
                {
                    resumeText,
                    jobText
                }
            );

        return response.data
            .keywordSimilarity;
    };