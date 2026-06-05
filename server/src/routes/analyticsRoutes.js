const express =
    require("express");

const router =
    express.Router();

const auth =
    require("../middleware/authMiddleware");

const role =
    require("../middleware/roleMiddleware");

const {

    getDashboardStats,

    getTopCandidates,

    getAverageScore,

    getTopSkills,

    getApplicationsPerJob

}
    =
    require(
        "../controllers/analyticsController"
    );

router.get(
    "/dashboard",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getDashboardStats
);

router.get(
    "/top-candidates",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getTopCandidates
);

router.get(
    "/average-score",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getAverageScore
);

router.get(
    "/top-skills",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getTopSkills
);

router.get(
    "/applications-per-job",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getApplicationsPerJob
);

module.exports = router;