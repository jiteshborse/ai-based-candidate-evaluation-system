const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.parseResume =
    async (filePath) => {

        const fileName = path.basename(filePath);
        const buffer = fs.readFileSync(filePath);
        const fileContent = buffer.toString("base64");

        const response =
            await axios.post(

                `${process.env.AI_SERVICE_URL}/parse-resume`,

                {
                    fileName,
                    fileContent
                }
            );

        return response.data;
    };