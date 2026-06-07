import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden bg-grid-cyber selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background spotlights */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full glow-spot-cyan pointer-events-none animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-[20%] right-[-15%] w-[60%] h-[60%] rounded-full glow-spot-purple pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-15%] left-[20%] w-[60%] h-[60%] rounded-full glow-spot-indigo pointer-events-none"></div>

      {/* Header / Navigation */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H14l1-5-8.982 11.795h5.813z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ATS<span className="text-indigo-400">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"></span>
              <span className="relative block px-5 py-2.5 rounded-[11px] bg-zinc-950 text-sm font-medium text-white transition-colors duration-200 group-hover:bg-zinc-900">
                Register Now
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        
        {/* Platform Badge */}
        <div className="animate-fade-in-up opacity-0 flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-semibold text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-950/20 mb-8" style={{ animationDelay: '0.1s' }}>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Next-Gen AI Screening Platform
        </div>

        {/* Hero Title */}
        <h1 className="animate-fade-in-up opacity-0 font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl leading-[1.1]" style={{ animationDelay: '0.2s' }}>
          AI-Based Candidate <br />
          <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            Evaluation System
          </span>
        </h1>

        {/* Hero Description */}
        <p className="animate-fade-in-up opacity-0 text-lg md:text-xl text-zinc-400 max-w-2xl mb-20 font-light leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Streamline your recruitment lifecycle with semantic AI resume screening, instant match scoring, automated evaluation reports, and multi-candidate analytics.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
          
          {/* Card 1: Resume Screening */}
          <div className="glass-card glass-card-hover p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-300"></div>
            
            <div className="w-12 h-12 rounded-xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 shadow-inner">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-200">
              Smart Screening
            </h3>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              Upload resumes and let our AI models parse, extract, and analyze skillsets, experiences, and qualifications in seconds.
            </p>
          </div>

          {/* Card 2: Automated Rankings */}
          <div className="glass-card glass-card-hover p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-300"></div>
            
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 shadow-inner">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            
            <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
              Dynamic Rankings
            </h3>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              Instantly rank applicants based on semantic match accuracy and job-specific criteria rather than plain keyword density.
            </p>
          </div>

          {/* Card 3: Deep AI Reports */}
          <div className="glass-card glass-card-hover p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-300"></div>
            
            <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 shadow-inner">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-200">
              Comparison Insights
            </h3>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              Generate visual candidate comparisons, PDF summaries, and comprehensive scorecards to make data-driven hiring calls.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs">
          <p>&copy; {new Date().getFullYear()} AI-Based Candidate Evaluation System. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-zinc-300 transition-colors duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-150">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;