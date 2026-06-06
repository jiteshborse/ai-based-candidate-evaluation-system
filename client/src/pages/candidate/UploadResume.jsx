import {
    useState
} from "react";

import DashboardLayout
    from "../../components/layout/DashboardLayout";

import {
    uploadResume
} from "../../services/resumeService";

function UploadResume() {

    const [file, setFile] =
        useState(null);

    const [loading,
        setLoading] =
        useState(false);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!file) {

                return alert(
                    "Please select a file"
                );
            }

            try {

                setLoading(true);

                const formData =
                    new FormData();

                formData.append(
                    "resume",
                    file
                );

                await uploadResume(
                    formData
                );

                alert(
                    "Resume uploaded successfully"
                );

                setFile(null);

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message
                    ||
                    "Upload failed"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">

                Upload Resume

            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow"
            >

                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                    className="mb-4"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >

                    {
                        loading
                            ?
                            "Uploading..."
                            :
                            "Upload Resume"
                    }

                </button>

            </form>

        </DashboardLayout>
    );
}

export default UploadResume;