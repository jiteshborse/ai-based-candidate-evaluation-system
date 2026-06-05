from fastapi import FastAPI
from parser import extract_text
from matcher import calculate_similarity

from skill_gap import (
    analyze_skill_gap,
    candidate_readiness,
    generate_recommendations
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

    path = data["filePath"]

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