import DashboardLayout from "../../components/layout/DashboardLayout";

function AdminDashboard() {

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold">

                Admin Dashboard

            </h1>

            <p className="mt-4">

                Manage users,
                recruiters,
                jobs and system analytics

            </p>

        </DashboardLayout>
    );
}

export default AdminDashboard;