import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user } = useAuth();
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (

        <header className="bg-zinc-950/40 border-b border-zinc-900/60 px-6 py-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-40">

            <h1 className="text-lg font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                ATS<span className="text-indigo-400">.AI</span>
            </h1>

            <div className="flex items-center gap-3">

                <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-zinc-200">
                        {user?.name}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-0.5">
                        {user?.role}
                    </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 border border-indigo-500/20 flex items-center justify-center text-white font-semibold shadow-md shadow-indigo-500/10">
                    {initial}
                </div>

            </div>

        </header>
    );
}

export default Navbar;