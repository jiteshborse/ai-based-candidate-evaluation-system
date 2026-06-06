import api from "./api";

export const getReports = async () => {
    const response = await api.get("/reports");
    return response.data;
};

export const generateReport = async (payload) => {
    const response = await api.post(
        "/reports/generate",
        payload
    );

    return response.data;
};