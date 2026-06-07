import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, forgotPassword } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [simulatedResetLink, setSimulatedResetLink] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }
        
        setIsLoading(true);
        try {
            const data = await loginUser(formData);
            login(data.token, data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid credentials. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error("Please enter your email");
            return;
        }

        setIsForgotLoading(true);
        setSimulatedResetLink("");
        try {
            const data = await forgotPassword(forgotEmail);
            toast.success("Reset link generated successfully!");
            if (data.token) {
                setSimulatedResetLink(`/reset-password/${data.token}`);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to request password reset."
            );
        } finally {
            setIsForgotLoading(false);
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
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to home
                    </Link>
                </div>

                {/* Card Container */}
                <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-12 h-12 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-cyan-500 items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Log in to manage or evaluate candidates
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotEmail("");
                                        setSimulatedResetLink("");
                                        setShowForgotModal(true);
                                    }}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-11 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
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

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl"></span>
                            <span className="relative flex items-center justify-center px-5 py-3.5 rounded-[11px] bg-zinc-950 font-semibold text-white transition-colors duration-200 group-hover:bg-zinc-900/50">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : "Sign In"}
                            </span>
                        </button>

                    </form>

                    {/* Footer Links */}
                    <div className="text-center mt-8 pt-6 border-t border-zinc-900">
                        <p className="text-sm text-zinc-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>

                </div>

            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
                    <div className="glass-card rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-800/80 animate-fade-in relative">
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="absolute top-4 right-4 text-zinc-550 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-xl font-bold text-white font-display mb-2">Recover Password</h3>
                        <p className="text-sm text-zinc-400 font-light mb-6">
                            Enter your email address below. We will generate a secure reset link for your account.
                        </p>

                        {simulatedResetLink ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-light space-y-2">
                                    <p className="font-semibold text-[13px] text-emerald-450">Reset Link Generated Successfully!</p>
                                    <p className="text-zinc-300">The link has been printed to the server terminal. Since this is a local sandbox, you can click directly below to reset your password:</p>
                                </div>
                                <Link
                                    to={simulatedResetLink}
                                    className="block text-center text-xs font-semibold bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white py-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
                                >
                                    Proceed to Password Reset
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6 border-t border-zinc-900/60 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="border border-zinc-800 hover:bg-zinc-900 text-zinc-350 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isForgotLoading}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                                    >
                                        {isForgotLoading ? "Processing..." : "Generate Reset Link"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default Login;