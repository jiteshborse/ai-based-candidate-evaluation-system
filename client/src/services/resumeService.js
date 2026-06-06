import api from "./api";

export const uploadResume = async (formData) => {

    const response = await api.post(
        "/resumes/upload",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const getResumes = async () => {

    const response = await api.get(
        "/resumes"
    );

    return response.data;
};

export const getResume = async (id) => {

    const response = await api.get(
        `/resumes/${id}`
    );

    return response.data;
};

export const deleteResume = async (id) => {

    const response = await api.delete(
        `/resumes/${id}`
    );

    return response.data;
};