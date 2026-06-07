import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({
    children
}) {

    return (

        <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden bg-grid-cyber">
            {/* Ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full glow-spot-indigo pointer-events-none animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full glow-spot-purple pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 z-10 relative">

                <Navbar />

                <main className="flex-1 p-6 md:p-8">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;