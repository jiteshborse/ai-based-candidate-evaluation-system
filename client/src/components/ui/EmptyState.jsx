function EmptyState({

    message

}) {

    return (

        <div className="bg-white p-10 rounded shadow text-center">

            <p className="text-gray-500">

                {message}

            </p>

        </div>
    );
}

export default EmptyState;