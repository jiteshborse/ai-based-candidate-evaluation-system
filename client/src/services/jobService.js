import api from "./api";

export const createJob = async (jobData) => {
    const response = await api.post(
        "/jobs",
        jobData
    );

    return response.data;
};

export const getJobs = async () => {
    const response = await api.get(
        "/jobs"
    );

    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(
        `/jobs/${id}`
    );

    return response.data;
};