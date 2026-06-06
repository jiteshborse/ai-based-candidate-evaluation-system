import DashboardLayout
    from "../../components/layout/DashboardLayout";

import {
    useAuth
} from "../../context/AuthContext";

function Profile() {

    const { user } =
        useAuth();

    return (

        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                My Profile
            </h1>

            <div className="bg-white p-6 rounded shadow">

                <p>
                    <strong>Name:</strong>
                    {" "}
                    {user?.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    {" "}
                    {user?.email}
                </p>

                <p>
                    <strong>Role:</strong>
                    {" "}
                    {user?.role}
                </p>

            </div>

        </DashboardLayout>
    );
}

export default Profile;