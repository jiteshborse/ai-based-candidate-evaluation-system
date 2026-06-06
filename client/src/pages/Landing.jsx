import {
    Link
} from "react-router-dom";

function Landing() {

    return (

        <div className="min-h-screen flex flex-col justify-center items-center">

            <h1 className="text-5xl font-bold mb-4">

                AI Candidate Evaluation System

            </h1>

            <p className="text-xl text-gray-600 mb-8">

                Smart Resume Screening &
                Candidate Ranking

            </p>

            <div className="flex gap-4">

                <Link
                    to="/login"
                    className="bg-blue-600 text-white px-6 py-3 rounded"
                >

                    Login

                </Link>

                <Link
                    to="/register"
                    className="bg-green-600 text-white px-6 py-3 rounded"
                >

                    Register

                </Link>

            </div>

        </div>
    );
}

export default Landing;