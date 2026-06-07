def normalize_skill(name):
    n = name.lower().strip()
    # Remove dots, dashes, and extra spaces
    n = n.replace(".", "").replace("-", "").replace(" ", "")
    
    synonyms = {
        "reactjs": "react",
        "react": "react",
        "nodejs": "node",
        "node": "node",
        "js": "javascript",
        "javascript": "javascript",
        "typescript": "typescript",
        "ts": "typescript",
        "postgres": "postgresql",
        "postgresql": "postgresql",
        "mongodb": "mongodb",
        "mongo": "mongodb",
        "ror": "ruby on rails",
        "rubyonrails": "ruby on rails",
        "python": "python",
        "py": "python",
        "golang": "go",
        "csharp": "c#",
        "cpp": "c++",
        "dockerize": "docker",
        "aws": "amazon web services",
        "gcp": "google cloud",
        "googlecloudplatform": "google cloud",
        "html5": "html",
        "css3": "css",
        "vuejs": "vue",
        "angularjs": "angular",
    }
    
    return synonyms.get(n, n)

def analyze_skill_gap(
    candidate_skills,
    required_skills
):
    required_normalized = {}
    for skill in required_skills:
        required_normalized[normalize_skill(skill)] = skill

    candidate_normalized = set(
        normalize_skill(skill)
        for skill in candidate_skills
    )

    matched_skills = []
    missing_skills = []

    for norm_skill, orig_skill in required_normalized.items():
        if norm_skill in candidate_normalized:
            matched_skills.append(orig_skill)
        else:
            missing_skills.append(orig_skill)

    matched_skills = list(set(matched_skills))
    missing_skills = list(set(missing_skills))

    if len(required_skills) == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / len(required_skills)) * 100,
            2
        )

    return {
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "matchPercentage": match_percentage
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