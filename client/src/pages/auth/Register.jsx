import {
    useState
} from "react";

import {
    registerUser
} from "../../services/authService";

import {
    useNavigate
} from "react-router-dom";

import {
    loginUser
} from "../../services/authService";

import {
    useAuth
} from "../../context/AuthContext";

function Register() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [formData,
        setFormData] =
        useState({

            name: "",
            email: "",
            password: "",
            role: "candidate"
        });

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

                await registerUser(
                    formData
                );

                const data =
                    await loginUser(
                        {
                            email:
                                formData.email,
                            password:
                                formData.password
                        }
                    );

                login(
                    data.token,
                    data.user
                );

                alert(
                    "Registration Successful"
                );

                navigate("/dashboard");

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message
                    ||
                    "Registration Failed"
                );
            }
        };

    return (

        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg p-8 rounded w-96"
            >

                <h2 className="text-2xl font-bold mb-6">
                    Register
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                />

                <select
                    name="role"
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                >
                    <option value="candidate">
                        Candidate
                    </option>

                    <option value="recruiter">
                        Recruiter
                    </option>
                </select>

                <button
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;