const requiredEnv = [

    "MONGO_URI",

    "JWT_SECRET",

    "AI_SERVICE_URL"

];

requiredEnv.forEach(env => {

    if (!process.env[env]) {

        throw new Error(
            `Missing ${env}`
        );

    }

});