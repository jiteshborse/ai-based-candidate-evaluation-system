const express = require("express");

const {
    register,
    login,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const {
    body
} =
    require(
        "express-validator"
    );

const router = express.Router();

router.post(

    "/register",

    [
        body("name")
            .notEmpty(),

        body("email")
            .isEmail(),

        body("password")
            .isLength({
                min: 6
            })

    ],

    register
);
router.post("/login", login);

router.post(
    "/forgot-password",
    [
        body("email").isEmail()
    ],
    forgotPassword
);

router.post(
    "/reset-password/:token",
    [
        body("password").isLength({ min: 6 })
    ],
    resetPassword
);

module.exports = router;