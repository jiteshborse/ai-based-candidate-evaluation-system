const axios =
    require("axios");

exports.compareCandidates =
    async (
        candidateA,
        candidateB
    ) => {

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/compare-candidates`,

                {
                    candidateA,
                    candidateB
                }
            );

        return response.data;
    };