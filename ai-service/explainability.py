def generate_strengths(

    skill_score,

    experience_score,

    education_score,

    ats_score

):

    strengths = []

    if skill_score >= 80:

        strengths.append(
            "Strong skill match with job requirements"
        )

    if experience_score >= 80:

        strengths.append(
            "Relevant experience meets expectations"
        )

    if education_score == 100:

        strengths.append(
            "Education requirement satisfied"
        )

    if ats_score >= 80:

        strengths.append(
            "Resume is ATS friendly"
        )

    return strengths

def generate_weaknesses(

    missing_skills,

    ats_score

):

    weaknesses = []

    for skill in missing_skills:

        weaknesses.append(
            f"Missing skill: {skill}"
        )

    if ats_score < 60:

        weaknesses.append(
            "Low ATS optimization score"
        )

    return weaknesses

def recommendation_reason(
    final_score
):

    if final_score >= 90:

        return (
            "Candidate is highly suitable for the role."
        )

    elif final_score >= 80:

        return (
            "Candidate meets most technical and business requirements."
        )

    elif final_score >= 70:

        return (
            "Candidate is suitable but may require minor upskilling."
        )

    elif final_score >= 50:

        return (
            "Candidate partially meets requirements."
        )

    return (
        "Candidate does not sufficiently match job requirements."
    )
    
def explain_formula(

    skill_score,

    experience_score,

    education_score,

    similarity

):

    return {

        "skillContribution":
            round(skill_score * 0.40, 2),

        "experienceContribution":
            round(experience_score * 0.25, 2),

        "educationContribution":
            round(education_score * 0.15, 2),

        "keywordContribution":
            round(similarity * 0.20, 2)
    }