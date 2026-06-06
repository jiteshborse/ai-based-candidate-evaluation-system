import DashboardLayout from "../components/layout/DashboardLayout";

import StatCard from "../components/ui/StatCard";

function Dashboard() {

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">

                Dashboard

            </h1>

            <div className="grid md:grid-cols-4 gap-4">

                <StatCard
                    title="Total Jobs"
                    value="12"
                />

                <StatCard
                    title="Candidates"
                    value="45"
                />

                <StatCard
                    title="Resumes"
                    value="120"
                />

                <StatCard
                    title="Shortlisted"
                    value="18"
                />

            </div>

        </DashboardLayout>
    );
}

export default Dashboard;