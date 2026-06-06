const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
    applyJob,
    getMyApplications,
    getJobApplications
} = require("../controllers/applicationController");

router.post("/", auth, role("candidate"), applyJob);
router.get("/my", auth, role("candidate"), getMyApplications);
router.get("/job/:jobId", auth, role("recruiter", "admin"), getJobApplications);

module.exports = router;
