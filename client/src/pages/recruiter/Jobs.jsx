import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    createJob,
    getJobs,
    deleteJob
} from "../../services/jobService";

function Jobs() {

    const [jobs, setJobs] =
        useState([]);

    const [formData, setFormData] =
        useState({

            title: "",

            description: "",

            requiredSkills: ""
        });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs =
        async () => {

            try {

                const data =
                    await getJobs();

                setJobs(
                    data.data || []
                );

            } catch (error) {

                console.error(error);
            }
        };

    const handleChange =
        (e) => {

            setFormData({

                ...formData,

                [e.target.name]:
                    e.target.value
            });
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                await createJob({

                    title:
                        formData.title,

                    description:
                        formData.description,

                    requiredSkills:
                        formData.requiredSkills
                            .split(",")
                            .map(skill =>
                                skill.trim()
                            )
                });

                alert(
                    "Job Created"
                );

                setFormData({

                    title: "",

                    description: "",

                    requiredSkills: ""
                });

                fetchJobs();

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message
                    ||
                    "Failed"
                );
            }
        };

    const handleDelete =
        async (id) => {

            try {

                await deleteJob(id);

                fetchJobs();

            } catch (error) {

                console.error(error);
            }
        };

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">

                Job Management

            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow mb-6"
            >

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    className="w-full border p-2 mb-4"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    className="w-full border p-2 mb-4"
                />

                <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full border p-2 mb-4"
                />

                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Create Job
                </button>

            </form>

            <div className="grid gap-4">

                {
                    jobs.map(job => (

                        <div
                            key={job._id}
                            className="bg-white p-4 rounded shadow"
                        >

                            <h2 className="text-xl font-bold">

                                {job.title}

                            </h2>

                            <p className="mt-2">

                                {job.description}

                            </p>

                            <div className="mt-3">

                                {
                                    job.requiredSkills?.map(
                                        skill => (

                                            <span
                                                key={skill}
                                                className="bg-blue-100 px-2 py-1 rounded mr-2"
                                            >
                                                {skill}
                                            </span>

                                        ))
                                }

                            </div>

                            <button
                                onClick={() =>
                                    handleDelete(
                                        job._id
                                    )
                                }
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>

                        </div>

                    ))
                }

            </div>

        </DashboardLayout>
    );
}

export default Jobs;