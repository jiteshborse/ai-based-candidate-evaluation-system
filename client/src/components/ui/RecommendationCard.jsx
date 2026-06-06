function RecommendationCard({

    recommendation,

    confidence

}) {

    return (

        <div className="bg-white p-4 rounded shadow">

            <h3 className="font-bold">

                AI Recommendation

            </h3>

            <p>

                {recommendation}

            </p>

            <p>

                Confidence:
                {" "}
                {confidence}%

            </p>

        </div>
    );
}

export default RecommendationCard;