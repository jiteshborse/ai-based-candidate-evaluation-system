from ats_engine import *
from fastapi import FastAPI
from parser import extract_text
import os
import base64
import io
from matcher import calculate_similarity

from skill_gap import (
    analyze_skill_gap,
    candidate_readiness,
    generate_recommendations
)

from comparison import (
    overall_candidate_score,
    determine_winner,
    compare_advantages,
    comparison_recommendation
)

from explainability import (
    generate_strengths,
    generate_weaknesses,
    recommendation_reason,
    explain_formula
)

from recommendation import (
    generate_recommendation,
    calculate_confidence,
    generate_decision,
    generate_reasons
)

from resume_analyzer import (
    detect_sections,
    find_missing_sections,
    calculate_ats_score,
    calculate_resume_strength,
    generate_grade,
    generate_suggestions
)

from extractor import (
    extract_name,
    extract_location,
    extract_skills,
    extract_keywords,
    extract_education,
    extract_experience
)

from utils.contact_extractor import (
    extract_email,
    extract_phone
)

from utils.education_extractor import (
    extract_education
)

from utils.project_extractor import (
    extract_projects
)

from utils.certification_extractor import (
    extract_certifications
)

app = FastAPI()

@app.post("/parse-resume")
def parse_resume(data: dict):

    # Support either a direct file path (legacy) or a base64 fileContent + fileName
    if "fileContent" in data:

        file_name = data.get("fileName", "resume")
        extension = os.path.splitext(file_name)[1].lower()

        file_bytes = base64.b64decode(data["fileContent"])

        if extension == ".pdf":
            from pypdf import PdfReader

            reader = PdfReader(io.BytesIO(file_bytes))

            text = ""

            for page in reader.pages:
                text += page.extract_text() or ""

        elif extension == ".docx":
            from docx import Document

            document = Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in document.paragraphs]
            text = "\n".join(paragraphs)

        elif extension == ".txt":
            text = file_bytes.decode("utf-8", errors="ignore")

        else:
            raise Exception(f"Unsupported file type: {extension}")

    else:

        path = data["filePath"]
        file_type = (
            os.path.splitext(
                path
            )[1]
        )

        text = extract_text(path)

    return {

        "name":
            extract_name(text),

        "email":
            extract_email(text),

        "phone":
            extract_phone(text),

        "location":
            extract_location(text),

        "skills":
            extract_skills(text),

        "education":
            extract_education(text),

        "experience":
            extract_experience(text),

        "projects":
            extract_projects(text),

        "certifications":
            extract_certifications(text),

        "keywords":
            extract_keywords(text),

        "rawText":
            text
    }
    
@app.post("/rank-candidate")
def rank_candidate(data: dict):

    resume_text = data["resumeText"]
    job_text = data["jobText"]

    similarity = calculate_similarity(
        resume_text,
        job_text
    )

    return {
        "keywordSimilarity":
        similarity
    }
    
@app.post("/skill-gap-analysis")
def skill_gap_analysis(data: dict):

    candidate_skills = data["candidateSkills"]
    required_skills = data["requiredSkills"]

    result = analyze_skill_gap(
        candidate_skills,
        required_skills
    )

    readiness = candidate_readiness(
        result["matchPercentage"]
    )

    recommendations = generate_recommendations(
        result["missingSkills"]
    )

    return {
        **result,
        "candidateReadiness": readiness,
        "recommendations": recommendations
    }
    
@app.post("/analyze-resume")
def analyze_resume(data: dict):

    text = data["resumeText"]

    skills = data.get(
            "skills",
            []
        )

    projects = data.get(
            "projects",
            []
        )

    certifications = data.get(
            "certifications",
            []
        )

    found_sections = detect_sections(text)

    missing_sections = find_missing_sections(
            found_sections
        )

    ats_score = calculate_ats_score(
            found_sections
        )

    strength = calculate_resume_strength(
            len(skills),
            len(projects),
            len(certifications),
            ats_score
        )

    grade = generate_grade(
            strength
        )

    suggestions = generate_suggestions(
            missing_sections,
            len(skills),
            len(projects),
            len(certifications)
        )

    return {

        "resumeStrength":
            strength,

        "atsScore":
            ats_score,

        "grade":
            grade,

        "sectionsFound":
            found_sections,

        "missingSections":
            missing_sections,

        "suggestions":
            suggestions
    }
    
@app.post("/recommendation")
def recommendation(data: dict):

    final_score = data["finalScore"]

    ats_score = data["atsScore"]

    skill_match = data["skillMatch"]

    experience_score = data["experienceScore"]

    recommendation = generate_recommendation(
            final_score
        )

    confidence = calculate_confidence(
            final_score,
            ats_score,
            skill_match
        )

    decision = generate_decision(
            recommendation
        )

    reasons = generate_reasons(
            final_score,
            ats_score,
            skill_match,
            experience_score
        )

    return {

        "recommendation":
            recommendation,

        "confidence":
            confidence,

        "decision":
            decision,

        "reasons":
            reasons
    }
    
@app.post("/explain-ranking")
def explain_ranking(data: dict):

    strengths = generate_strengths(

        data["skillScore"],

        data["experienceScore"],

        data["educationScore"],

        data["atsScore"]
    )

    weaknesses = generate_weaknesses(

        data["missingSkills"],

        data["atsScore"]
    )

    formula = explain_formula(

        data["skillScore"],

        data["experienceScore"],

        data["educationScore"],

        data["keywordSimilarity"]
    )

    reason = recommendation_reason(
        data["finalScore"]
    )

    return {

        "strengths":
            strengths,

        "weaknesses":
            weaknesses,

        "scoreBreakdown":
            formula,

        "recommendationReason":
            reason
    }
    
@app.post("/ats-score")
def ats_score(data: dict):

    structure = structure_score(
        data["sectionsFound"]
    )

    skills = skill_coverage_score(
        data["matchedSkills"],
        data["requiredSkills"]
    )

    keywords = keyword_score(
        data["keywordSimilarity"]
    )

    experience = experience_score(
        data["experienceMatch"]
    )

    education = education_score(
        data["educationMatch"]
    )

    projects = project_score(
        data["projectsCount"]
    )

    certifications = certification_score(
        data["certificationsCount"]
    )

    total_score = round(

        structure +
        skills +
        keywords +
        experience +
        education +
        projects +
        certifications

    )

    return {

        "atsScore":
            total_score,

        "grade":
            ats_grade(
                total_score
            ),

        "atsStatus":
            ats_status(
                total_score
            ),

        "breakdown": {

            "resumeStructure":
                structure,

            "skillCoverage":
                skills,

            "keywordOptimization":
                keywords,

            "experienceRelevance":
                experience,

            "educationMatch":
                education,

            "projects":
                projects,

            "certifications":
                certifications
        }
    }
    
@app.post("/compare-candidates")
def compare_candidates(
    data: dict
):

    candidate_a = data["candidateA"]
    candidate_b = data["candidateB"]
    
    name_a = candidate_a.get("name", "Candidate A")
    name_b = candidate_b.get("name", "Candidate B")

    score_a = overall_candidate_score(
            candidate_a["finalScore"],
            candidate_a["atsScore"],
            candidate_a["confidence"]
        )

    score_b = overall_candidate_score(
            candidate_b["finalScore"],
            candidate_b["atsScore"],
            candidate_b["confidence"]
        )

    winner = determine_winner(
            score_a,
            score_b,
            name_a,
            name_b
        )

    advantages = compare_advantages(
            candidate_a,
            candidate_b
        )

    recommendation = comparison_recommendation(
            winner
        )

    return {

        "winner":
            winner,

        "comparisonScore": {

            "candidateA":
                score_a,

            "candidateB":
                score_b
        },

        "advantages":
            advantages,

        "recommendation":
            recommendation
    }