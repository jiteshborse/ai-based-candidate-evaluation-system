const express =
    require("express");

const router =
    express.Router();

const auth =
    require("../middleware/authMiddleware");

const role =
    require("../middleware/roleMiddleware");

const {

    generateReport,

    getReports,

    downloadReport,

    deleteReport

}
    =
    require(
        "../controllers/reportController"
    );

router.post(
    "/generate",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    generateReport
);

router.get(
    "/",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    getReports
);

router.get(
    "/download/:id",
    auth,
    downloadReport
);

router.delete(
    "/:id",
    auth,
    role(
        "admin",
        "recruiter"
    ),
    deleteReport
);

module.exports = router;