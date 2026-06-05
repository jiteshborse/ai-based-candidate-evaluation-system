const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "recruiter",
        "admin"
    ),
    createJob
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "recruiter",
        "admin"
    ),
    updateJob
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "recruiter",
        "admin"
    ),
    deleteJob
);

module.exports = router;