const express =
    require("express");

const router =
    express.Router();

const auth =
    require("../middleware/authMiddleware");

const role =
    require("../middleware/roleMiddleware");

const {
    generateRanking,
    getRankings
}
    =
    require(
        "../controllers/rankingController"
    );

router.post(
    "/generate",
    auth,
    role(
        "recruiter",
        "admin"
    ),
    generateRanking
);

router.get(
    "/:jobId",
    auth,
    getRankings
);

module.exports = router;