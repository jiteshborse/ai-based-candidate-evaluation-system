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

app.use(limiter);

app.use(cors({

    origin:
        process.env.CLIENT_URL,

    credentials: true

}));

app.use(helmet());

app.use(express.json());

app.use(
    morgan("dev")
);

app.use(
    errorMiddleware
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