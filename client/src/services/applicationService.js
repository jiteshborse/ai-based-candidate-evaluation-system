import api from "./api";

export const applyToJob = async (jobId, resumeId) => {
    const response = await api.post("/applications", { jobId, resumeId });
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/applications/my");
    return response.data;
};

export const getJobApplications = async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
};
