const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generatePDF = async (
    job,
    rankings
) => {

    const fileName =
        `report-${Date.now()}.pdf`;

    const reportsDir = path.join(__dirname, "../../reports");
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath =
        path.join(
            reportsDir,
            fileName
        );

    const doc =
        new PDFDocument();

    doc.pipe(
        fs.createWriteStream(
            reportPath
        )
    );

    doc.fontSize(20)
        .text(
            "Candidate Ranking Report",
            {
                align: "center"
            }
        );

    doc.moveDown();

    doc.fontSize(14)
        .text(
            `Job Title: ${job.title}`
        );

    doc.text(
        `Experience Required: ${job.experienceMin} Years`
    );

    doc.moveDown();

    rankings.forEach(
        (candidate, index) => {

            doc.text(
                `${index + 1}. Candidate ID: ${candidate.candidateId}`
            );

            doc.text(
                `Final Score: ${candidate.finalScore}`
            );

            doc.text(
                `Skill Score: ${candidate.skillScore}`
            );

            doc.text(
                `Experience Score: ${candidate.experienceScore}`
            );

            doc.text(
                `Education Score: ${candidate.educationScore}`
            );

            doc.text(
                `Keyword Similarity: ${candidate.keywordSimilarity}`
            );

            doc.moveDown();
        }
    );

    doc.end();

    return reportPath;
};