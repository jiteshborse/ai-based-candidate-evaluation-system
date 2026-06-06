const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    uploadResume,
    getResume,
    deleteResume,
    getMyResumes
} = require(
    "../controllers/resumeController"
);

router.post(
    "/upload",

    authMiddleware,

    roleMiddleware(
        "candidate",
        "admin"
    ),

    upload.single("resume"),

    uploadResume
);

router.get(
    "/",
    authMiddleware,
    getMyResumes
);

router.get(
    "/:id",
    authMiddleware,
    getResume
);

router.delete(
    "/:id",
    authMiddleware,
    deleteResume
);

module.exports = router;