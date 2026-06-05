const express = require("express");
const cors = require("cors");

const authRoutes =
    require("./routes/authRoutes");

const jobRoutes =
    require("./routes/jobRoutes");

const resumeRoutes =
    require("./routes/resumeRoutes");

const rankingRoutes =
    require("./routes/rankingRoutes");

const analyticsRoutes =
    require("./routes/analyticsRoutes");

const reportRoutes =
    require("./routes/reportRoutes");

const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/rankings",
    rankingRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);

app.use(
    "/api/jobs",
    jobRoutes
);

app.use(
    "/api/resumes",
    resumeRoutes
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname,
            "../uploads")
    )
);

app.use(
    "/reports",
    express.static(
        path.join(
            __dirname,
            "../reports"
        )
    )
);

module.exports = app;