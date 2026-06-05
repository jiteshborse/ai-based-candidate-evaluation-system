const axios =
    require("axios");

exports.analyzeResume =
    async (
        resumeText,
        skills,
        projects,
        certifications
    ) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/analyze-resume`,

                {
                    resumeText,
                    skills,
                    projects,
                    certifications
                }
            );

        return response.data;
    };