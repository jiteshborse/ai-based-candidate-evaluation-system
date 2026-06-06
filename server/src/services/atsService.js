const axios = require("axios");

exports.getATSScore = async (payload) => {

    const response =
        await axios.post(
            `${process.env.AI_SERVICE_URL}/ats-score`,
            payload
        );

    return response.data;
};