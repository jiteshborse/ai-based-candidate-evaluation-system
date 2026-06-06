function StatCard({

    title,

    value

}) {

    return (

        <div className="bg-white p-5 rounded-lg shadow">

            <h3 className="text-gray-500">

                {title}

            </h3>

            <p className="text-3xl font-bold">

                {value}

            </p>

        </div>
    );
}

export default StatCard;