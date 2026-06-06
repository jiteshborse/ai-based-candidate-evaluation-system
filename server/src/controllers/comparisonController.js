const comparisonService =
    require(
        "../services/comparisonService"
    );

exports.compareCandidates =
    async (req, res) => {

        try {

            const {

                candidateA,

                candidateB

            } = req.body;

            const result =
                await comparisonService
                    .compareCandidates(

                        candidateA,

                        candidateB

                    );

            res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }
    };