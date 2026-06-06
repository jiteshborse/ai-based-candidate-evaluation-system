def generate_recommendation(
    final_score
):

    if final_score >= 90:
        return "Strong Hire"

    elif final_score >= 80:
        return "Highly Recommended"

    elif final_score >= 70:
        return "Recommended"

    elif final_score >= 50:
        return "Average Match"

    return "Not Recommended"

def calculate_confidence(
    final_score,
    ats_score,
    skill_match
):

    confidence = (

        final_score * 0.50

        +

        ats_score * 0.20

        +

        skill_match * 0.30

    )

    return round(
        confidence,
        2
    )
    
def generate_decision(
    recommendation
):

    if recommendation in [

        "Strong Hire",

        "Highly Recommended"

    ]:

        return "Shortlist"

    elif recommendation == "Recommended":

        return "Consider"

    return "Reject"

def generate_reasons(

    final_score,

    ats_score,

    skill_match,

    experience_score

):

    reasons = []

    if skill_match >= 80:

        reasons.append(
            "Strong skill alignment with job requirements"
        )

    if experience_score >= 80:

        reasons.append(
            "Experience requirement satisfied"
        )

    if ats_score >= 80:

        reasons.append(
            "Excellent ATS compatibility"
        )

    if final_score >= 85:

        reasons.append(
            "High overall candidate score"
        )

    if not reasons:

        reasons.append(
            "Candidate requires further review"
        )

    return reasons

