SECTION_KEYWORDS = {

    "Skills": [
        "skills",
        "technical skills"
    ],

    "Education": [
        "education",
        "academic"
    ],

    "Projects": [
        "projects",
        "project"
    ],

    "Experience": [
        "experience",
        "work experience"
    ],

    "Certifications": [
        "certifications",
        "certificate",
        "certified"
    ]
}

def detect_sections(text):

    found_sections = []

    text_lower = text.lower()

    for section, keywords in SECTION_KEYWORDS.items():

        for keyword in keywords:

            if keyword in text_lower:

                found_sections.append(section)
                break

    return found_sections

def find_missing_sections(
    found_sections
):

    all_sections = list(
            SECTION_KEYWORDS.keys()
        )

    missing = []

    for section in all_sections:

        if section not in found_sections:

            missing.append(section)

    return missing

def calculate_ats_score(
    found_sections
):

    total_sections = len(
            SECTION_KEYWORDS
        )

    score = round(

        (
            len(found_sections)
            /
            total_sections
        ) * 100

    )

    return score

def calculate_resume_strength(
    skills_count,
    project_count,
    certification_count,
    ats_score
):

    score = 0

    score += min(
        skills_count * 4,
        30
    )

    score += min(
        project_count * 10,
        30
    )

    score += min(
        certification_count * 5,
        15
    )

    score += (
        ats_score * 0.25
    )

    return min(
        round(score),
        100
    )
    
def generate_grade(score):

    if score >= 85:
        return "A"

    elif score >= 70:
        return "B"

    elif score >= 55:
        return "C"

    return "D"

def generate_suggestions(
    missing_sections,
    skills_count,
    project_count,
    certification_count
):

    suggestions = []

    if "Projects" in missing_sections:

        suggestions.append(
            "Add project section"
        )

    if "Certifications" in missing_sections:

        suggestions.append(
            "Add certifications"
        )

    if skills_count < 5:

        suggestions.append(
            "Add more technical skills"
        )

    if project_count < 2:

        suggestions.append(
            "Include more projects"
        )

    if certification_count < 1:

        suggestions.append(
            "Complete industry certifications"
        )

    return suggestions

