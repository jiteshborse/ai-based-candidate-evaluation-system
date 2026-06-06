def structure_score(
    sections_found
):

    max_sections = 5

    score = (

        len(sections_found)
        /
        max_sections

    ) * 20

    return round(score, 2)

def skill_coverage_score(
    matched_skills,
    required_skills
):

    if len(required_skills) == 0:
        return 0

    score = (

        len(matched_skills)
        /
        len(required_skills)

    ) * 25

    return round(score, 2)

def keyword_score(
    similarity
):

    score = (
        similarity
        /
        100
    ) * 20

    return round(score, 2)

def experience_score(
    experience_match
):

    score = (
        experience_match
        /
        100
    ) * 15

    return round(score, 2)

def education_score(
    education_match
):

    score = (
        education_match
        /
        100
    ) * 10

    return round(score, 2)

def project_score(
    projects_count
):

    return min(
        projects_count * 2.5,
        5
    )
    
def certification_score(
    certifications_count
):

    return min(
        certifications_count * 2.5,
        5
    )
    
def ats_grade(score):

    if score >= 90:
        return "A+"

    elif score >= 80:
        return "A"

    elif score >= 70:
        return "B"

    elif score >= 60:
        return "C"

    return "D"

def ats_status(score):

    if score >= 90:
        return "Outstanding"

    elif score >= 80:
        return "Excellent"

    elif score >= 70:
        return "Good"

    elif score >= 60:
        return "Average"

    return "Needs Improvement"