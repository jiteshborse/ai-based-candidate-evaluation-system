const rateLimit =
    require("express-rate-limit");

const isDev = process.env.NODE_ENV !== "production";

const limiter = rateLimit({

    windowMs:
        15 * 60 * 1000,

    max: isDev ? 10000 : 100,

    message:
        "Too many requests. Try again later."

});

module.exports = limiter;