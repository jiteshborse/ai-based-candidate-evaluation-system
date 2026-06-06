import api from "./api";

export const compareCandidates = async (candidateA, candidateB) => {
    const response = await api.post("/comparison", { candidateA, candidateB });
    return response.data;
};
