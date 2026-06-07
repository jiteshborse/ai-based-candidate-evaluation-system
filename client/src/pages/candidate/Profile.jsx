import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiShield } from "react-icons/fi";

function Profile() {
    const { user } = useAuth();
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                        <FiUser className="text-indigo-400" /> My Profile
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage your account information and credentials.</p>
                </div>

                {/* Profile Card */}
                <div className="glass-card p-8 rounded-3xl shadow-xl border border-zinc-900/60 relative overflow-hidden flex flex-col items-center sm:items-start sm:flex-row gap-6">
                    {/* circular avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-cyan-500 border border-indigo-500/20 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-indigo-500/10 flex-shrink-0">
                        {initial}
                    </div>

                    <div className="flex-grow space-y-6 w-full text-center sm:text-left">
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display leading-tight">{user?.name}</h2>
                            <p className="text-xs text-zinc-500 capitalize mt-1.5 flex items-center justify-center sm:justify-start gap-1 font-medium">
                                <FiShield className="text-indigo-400" /> Platform Role: {user?.role}
                            </p>
                        </div>

                        <div className="border-t border-zinc-900/60 pt-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-zinc-300 font-light justify-center sm:justify-start">
                                <FiUser className="text-zinc-500 flex-shrink-0" />
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name</span>
                                    <span className="text-zinc-300 mt-0.5 block">{user?.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-zinc-300 font-light justify-center sm:justify-start">
                                <FiMail className="text-zinc-500 flex-shrink-0" />
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Email Address</span>
                                    <span className="text-zinc-305 mt-0.5 block">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default Profile;