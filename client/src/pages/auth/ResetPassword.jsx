import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await resetPassword(token, password);
            toast.success(data.message || "Password reset successful!");
            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid or expired reset token. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden flex items-center justify-center bg-grid-cyber px-4 selection:bg-indigo-500/30 selection:text-indigo-200">
            
            {/* Background ambient glow spots */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full glow-spot-indigo pointer-events-none animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full glow-spot-purple pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to login
                    </Link>
                </div>

                {/* Card Container */}
                <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-12 h-12 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-cyan-500 items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5-4v12m0 0l-3-3m3 3l3-3M8 11a4 4 0 018 0v4H8v-4z" />
                            </svg>
                        </div>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
                            Reset Password
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Enter your new account password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                New Password
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-350 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
                        >
                            <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl"></span>
                            <span className="relative flex items-center justify-center px-5 py-3.5 rounded-[11px] bg-zinc-950 font-semibold text-white transition-colors duration-200 group-hover:bg-zinc-900/50">
                                {isLoading ? "Saving password..." : "Reset Password"}
                            </span>
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;
