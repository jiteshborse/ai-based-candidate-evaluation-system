from fastapi import FastAPI
from parser import extract_text
from matcher import calculate_similarity

from extractor import (
    extract_skills,
    extract_keywords,
    extract_education,
    extract_experience
)

app = FastAPI()

@app.post("/parse-resume")
def parse_resume(data: dict):

    path = data["filePath"]

    text = extract_text(path)

    skills = extract_skills(text)

    education = extract_education(text)

    experience = extract_experience(text)

    keywords = extract_keywords(text)

    return {

        "skills": skills,

        "education": education,

        "experience": experience,

        "keywords": keywords,

        "rawText": text
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