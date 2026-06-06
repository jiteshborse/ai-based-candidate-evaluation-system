import api from "./api";

export const generateRanking =
    async (jobId) => {

        const response =
            await api.post(

                `/rankings/generate`,

                { jobId }

            );

        return response.data;
    };

export const getRankings =
    async (jobId) => {

        const response =
            await api.get(

                `/rankings/${jobId}`

            );

        return response.data;
    };