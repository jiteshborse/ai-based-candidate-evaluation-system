import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    FiGrid, FiUser, FiSearch, FiUploadCloud, FiFileText, 
    FiBriefcase, FiAward, FiSliders, FiPieChart, 
    FiDownload, FiUsers, FiLogOut 
} from "react-icons/fi";

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            isActive(path)
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-950/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40 border border-transparent"
        }`;

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-900/60 min-h-screen flex flex-col justify-between py-6 px-4">
            <div>
                {/* Brand / Logo */}
                <div className="px-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        AI
                    </div>
                    <span className="font-display text-lg font-bold tracking-wider text-white">
                        ATS<span className="text-indigo-400">.AI</span>
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-2">
                    <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                        <FiGrid className="w-4.5 h-4.5" />
                        Dashboard
                    </Link>

                    {/* Candidate Section */}
                    {user?.role === "candidate" && (
                        <>
                            <Link to="/profile" className={navLinkClass("/profile")}>
                                <FiUser className="w-4.5 h-4.5" />
                                My Profile
                            </Link>

                            <Link to="/browse-jobs" className={navLinkClass("/browse-jobs")}>
                                <FiSearch className="w-4.5 h-4.5" />
                                Browse Jobs
                            </Link>

                            <Link to="/upload-resume" className={navLinkClass("/upload-resume")}>
                                <FiUploadCloud className="w-4.5 h-4.5" />
                                Upload Resume
                            </Link>

                            <Link to="/my-resumes" className={navLinkClass("/my-resumes")}>
                                <FiFileText className="w-4.5 h-4.5" />
                                My Resumes
                            </Link>
                        </>
                    )}

                    {/* Recruiter Section */}
                    {user?.role === "recruiter" && (
                        <>
                            <Link to="/jobs" className={navLinkClass("/jobs")}>
                                <FiBriefcase className="w-4.5 h-4.5" />
                                Job Postings
                            </Link>

                            <Link to="/rankings" className={navLinkClass("/rankings")}>
                                <FiAward className="w-4.5 h-4.5" />
                                Ranks & Scores
                            </Link>

                            <Link to="/comparison" className={navLinkClass("/comparison")}>
                                <FiSliders className="w-4.5 h-4.5" />
                                Candidate Match
                            </Link>

                            <Link to="/analytics" className={navLinkClass("/analytics")}>
                                <FiPieChart className="w-4.5 h-4.5" />
                                Analytics
                            </Link>

                            <Link to="/reports" className={navLinkClass("/reports")}>
                                <FiDownload className="w-4.5 h-4.5" />
                                PDF Reports
                            </Link>
                        </>
                    )}

                    {/* Admin Section */}
                    {user?.role === "admin" && (
                        <>
                            <Link to="/users" className={navLinkClass("/users")}>
                                <FiUsers className="w-4.5 h-4.5" />
                                Users List
                            </Link>

                            <Link to="/analytics" className={navLinkClass("/analytics")}>
                                <FiPieChart className="w-4.5 h-4.5" />
                                Analytics
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="px-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 cursor-pointer"
                >
                    <FiLogOut className="w-4.5 h-4.5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;