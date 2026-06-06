const express =
    require("express");

const router =
    express.Router();

const auth =
    require("../middleware/authMiddleware");

const role =
    require("../middleware/roleMiddleware");

const {
    compareCandidates
}
    =
    require(
        "../controllers/comparisonController"
    );

router.post(

    "/",

    auth,

    role(
        "admin",
        "recruiter"
    ),

    compareCandidates

);

module.exports =
    router;