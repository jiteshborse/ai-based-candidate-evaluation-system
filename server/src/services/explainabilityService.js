const axios =
    require("axios");

exports.getExplanation =
    async (payload) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/explain-ranking`,

                payload

            );

        return response.data;
    };