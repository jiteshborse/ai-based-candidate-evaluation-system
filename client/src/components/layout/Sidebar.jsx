import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import {
    useNavigate
} from "react-router-dom";

function Sidebar() {

    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return (

        <aside className="w-64 bg-gray-900 text-white min-h-screen">

            <div className="p-6 text-2xl font-bold">

                ATS

            </div>

            <nav className="flex flex-col gap-3 p-4">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                {user?.role ===
                    "candidate" && (

                        <>
                            <Link
                                to="/profile"
                            >
                                Profile
                            </Link>

                            <Link
                                to="/browse-jobs"
                            >
                                Browse Jobs
                            </Link>

                            <Link
                                to="/upload-resume"
                            >
                                Upload Resume
                            </Link>

                            <Link
                                to="/my-resumes"
                            >
                                My Resumes
                            </Link>
                        </>
                    )}

                {user?.role ===
                    "recruiter" && (

                        <>
                            <Link
                                to="/jobs"
                            >
                                Jobs
                            </Link>

                            <Link
                                to="/rankings"
                            >
                                Rankings
                            </Link>

                            <Link
                                to="/comparison"
                            >
                                Comparison
                            </Link>

                            <Link
                                to="/analytics"
                            >
                                Analytics
                            </Link>

                            <Link
                                to="/reports"
                            >
                                Reports
                            </Link>
                        </>
                    )}

                {user?.role ===
                    "admin" && (

                        <>
                            <Link
                                to="/users"
                            >
                                Users
                            </Link>

                            <Link
                                to="/analytics"
                            >
                                Analytics
                            </Link>
                        </>
                    )}

                <button
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-2 rounded mt-5"
                >
                    Logout
                </button>

            </nav>

        </aside>
    );
}

export default Sidebar;