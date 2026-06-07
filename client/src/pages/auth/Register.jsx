import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleSelect = (role) => {
        setFormData({
            ...formData,
            role
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser(formData);
            const data = await loginUser({
                email: formData.email,
                password: formData.password
            });
            login(data.token, data.user);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden flex items-center justify-center bg-grid-cyber px-4 py-12 selection:bg-indigo-500/30 selection:text-indigo-200">
            
            {/* Background ambient glow spots */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full glow-spot-indigo pointer-events-none animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full glow-spot-purple pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
                
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Join the smart candidate evaluation platform
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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
                                    placeholder="john@example.com"
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                Password
                            </label>
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
                                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-11 pr-11 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
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

                        {/* Role Interactive Cards */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                                Select Your Role
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("candidate")}
                                    className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                        formData.role === "candidate"
                                            ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-950/20"
                                            : "border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/30"
                                    }`}
                                >
                                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm font-semibold block">Candidate</span>
                                    <span className="text-[10px] text-zinc-500 mt-1">Upload resumes, view jobs</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect("recruiter")}
                                    className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                        formData.role === "recruiter"
                                            ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-950/20"
                                            : "border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/30"
                                    }`}
                                >
                                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-semibold block">Recruiter</span>
                                    <span className="text-[10px] text-zinc-500 mt-1">Post jobs, screen & rank</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                        Creating Account...
                                    </span>
                                ) : "Register"}
                            </span>
                        </button>

                    </form>

                    {/* Footer Links */}
                    <div className="text-center mt-8 pt-6 border-t border-zinc-900">
                        <p className="text-sm text-zinc-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;