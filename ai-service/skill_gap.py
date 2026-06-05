def analyze_skill_gap(
    candidate_skills,
    required_skills
):

    candidate_set = set(
        skill.lower().strip()
        for skill in candidate_skills
    )

    required_set = set(
        skill.lower().strip()
        for skill in required_skills
    )

    matched_skills = list(
        candidate_set &
        required_set
    )

    missing_skills = list(
        required_set -
        candidate_set
    )

    if len(required_set) == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (
                len(matched_skills)
                /
                len(required_set)
            ) * 100,
            2
        )

    return {

        "matchedSkills":
            matched_skills,

        "missingSkills":
            missing_skills,

        "matchPercentage":
            match_percentage
    }
    
def candidate_readiness(
    percentage
):

    if percentage >= 90:
        return "Excellent Match"

    elif percentage >= 75:
        return "Strong Match"

    elif percentage >= 60:
        return "Good Match"

    elif percentage >= 40:
        return "Average Match"

    else:
        return "Weak Match"
    
def generate_recommendations(
    missing_skills
):

    recommendations = []

    for skill in missing_skills:

        recommendations.append(
            f"Learn {skill.title()}"
        )

    return recommendations