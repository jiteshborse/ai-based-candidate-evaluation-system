const express = require("express");
const cors = require("cors");

const comparisonRoutes =
    require(
        "./routes/comparisonRoutes"
    );

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

const applicationRoutes =
    require("./routes/applicationRoutes");

const limiter =
    require("./middleware/rateLimiter");

const morgan =
    require("morgan");

const errorMiddleware =
    require(
        "./middleware/errorMiddleware"
    );

const path = require("path");

const helmet = require("helmet");

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(
    morgan("dev")
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/comparison",
    comparisonRoutes
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
    "/api/applications",
    applicationRoutes
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

app.use(
    errorMiddleware
);

module.exports = app;