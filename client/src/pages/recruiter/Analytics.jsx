import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    getDashboardStats
} from "../../services/analyticsService";

import {

    PieChart,
    Pie,
    Cell,

    BarChart,
    Bar,

    XAxis,
    YAxis,

    Tooltip,

    ResponsiveContainer

} from "recharts";

function Analytics() {

    const [stats, setStats] =
        useState(null);

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData =
        async () => {

            try {

                const data =
                    await getDashboardStats();

                setStats(data);

            } catch (error) {

                console.error(error);

            }
        };

    if (!stats) {

        return (
            <DashboardLayout>

                Loading...

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">

                Analytics Dashboard

            </h1>

            {/* Stats Cards */}

            <div className="grid md:grid-cols-4 gap-4 mb-8">

                <div className="bg-white p-5 rounded shadow">

                    <h2>Total Candidates</h2>

                    <p className="text-3xl font-bold">

                        {stats.totalCandidates}

                    </p>

                </div>

                <div className="bg-white p-5 rounded shadow">

                    <h2>Total Recruiters</h2>

                    <p className="text-3xl font-bold">

                        {stats.totalRecruiters}

                    </p>

                </div>

                <div className="bg-white p-5 rounded shadow">

                    <h2>Total Jobs</h2>

                    <p className="text-3xl font-bold">

                        {stats.totalJobs}

                    </p>

                </div>

                <div className="bg-white p-5 rounded shadow">

                    <h2>Total Resumes</h2>

                    <p className="text-3xl font-bold">

                        {stats.totalResumes}

                    </p>

                </div>

            </div>

            {/* ATS Distribution */}

            <div className="bg-white p-6 rounded shadow mb-8">

                <h2 className="text-xl font-bold mb-4">

                    ATS Score Distribution

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart
                        data={stats.atsDistribution}
                    >

                        <XAxis dataKey="range" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="count" />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Top Skills */}

            <div className="bg-white p-6 rounded shadow mb-8">

                <h2 className="text-xl font-bold mb-4">

                    Top Skills

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart
                        data={stats.topSkills}
                    >

                        <XAxis dataKey="skill" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="count" />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Recommendation Chart */}

            <div className="bg-white p-6 rounded shadow">

                <h2 className="text-xl font-bold mb-4">

                    Hiring Recommendations

                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <PieChart>

                        <Pie

                            data={
                                stats.recommendationStats
                            }

                            dataKey="value"

                            nameKey="name"

                            outerRadius={100}

                        />

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </DashboardLayout>
    );
}

export default Analytics;