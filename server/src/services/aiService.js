const axios = require("axios");

exports.parseResume =
    async (filePath) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/parse-resume`,

                {
                    filePath
                }
            );

        return response.data;
    };