import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    return (

        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

            <h1 className="text-xl font-bold">
                AI Candidate Evaluation System
            </h1>

            <div>

                <span className="mr-4">
                    {user?.name}
                </span>

                <span className="bg-blue-100 px-3 py-1 rounded">

                    {user?.role}

                </span>

            </div>

        </header>
    );
}

export default Navbar;