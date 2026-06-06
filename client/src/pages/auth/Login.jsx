import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    loginUser
} from "../../services/authService";

import {
    useAuth
} from "../../context/AuthContext";

function Login() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [formData,
        setFormData] =
        useState({

            email: "",
            password: ""
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

                const data =
                    await loginUser(
                        formData
                    );

                login(
                    data.token,
                    data.user
                );

                navigate(
                    "/dashboard"
                );

            } catch (error) {

                alert(
                    error.response
                        ?.data?.message
                    ||
                    "Login Failed"
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
                    Login
                </h2>

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

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;