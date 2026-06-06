import { Link }
    from "react-router-dom";

function NotFound() {

    return (

        <div className="min-h-screen flex flex-col items-center justify-center">

            <h1 className="text-6xl font-bold">

                404

            </h1>

            <p>

                Page Not Found

            </p>

            <Link
                to="/"
                className="mt-4 text-blue-600"
            >
                Go Home
            </Link>

        </div>
    );
}

export default NotFound;