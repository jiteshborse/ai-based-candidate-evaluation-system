const {
    validationResult
}
    =
    require(
        "express-validator"
    );

const validate =
    require(
        "../middleware/validationMiddleware"
    );

router.post(

    "/register",

    validators,

    validate,

    register

);

module.exports = (
    req,
    res,
    next
) => {

    const errors =
        validationResult(req);

    if (
        !errors.isEmpty()
    ) {

        return res.status(400)
            .json({

                success: false,

                errors:
                    errors.array()

            });

    }

    next();
};