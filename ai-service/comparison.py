def overall_candidate_score(
    final_score,
    ats_score,
    confidence
):
    return round(
        (final_score * 0.60)
        + (ats_score * 0.20)
        + (confidence * 0.20),
        2
    )
    
def determine_winner(
    candidate_a_score,
    candidate_b_score,
    name_a="Candidate A",
    name_b="Candidate B"
):
    if candidate_a_score > candidate_b_score:
        return name_a
    elif candidate_b_score > candidate_a_score:
        return name_b
    return "Tie"

def compare_advantages(
    candidate_a,
    candidate_b
):
    advantages = []
    
    name_a = candidate_a.get("name", "Candidate A")
    name_b = candidate_b.get("name", "Candidate B")

    match_a = candidate_a.get("skillMatch", 0)
    match_b = candidate_b.get("skillMatch", 0)
    if match_a > match_b:
        advantages.append(f"{name_a} has a higher skill match ({match_a}% vs {match_b}%)")
    elif match_b > match_a:
        advantages.append(f"{name_b} has a higher skill match ({match_b}% vs {match_a}%)")

    exp_a = candidate_a.get("experienceScore", 0)
    exp_b = candidate_b.get("experienceScore", 0)
    if exp_a > exp_b:
        advantages.append(f"{name_a} has more relevant experience ({exp_a}% vs {exp_b}%)")
    elif exp_b > exp_a:
        advantages.append(f"{name_b} has more relevant experience ({exp_b}% vs {exp_a}%)")

    ats_a = candidate_a.get("atsScore", 0)
    ats_b = candidate_b.get("atsScore", 0)
    if ats_a > ats_b:
        advantages.append(f"{name_a} has a better ATS optimization score ({ats_a} vs {ats_b})")
    elif ats_b > ats_a:
        advantages.append(f"{name_b} has a better ATS optimization score ({ats_b} vs {ats_a})")

    final_a = candidate_a.get("finalScore", 0)
    final_b = candidate_b.get("finalScore", 0)
    if final_a > final_b:
        advantages.append(f"{name_a} has a higher final evaluation score ({final_a}% vs {final_b}%)")
    elif final_b > final_a:
        advantages.append(f"{name_b} has a higher final evaluation score ({final_b}% vs {final_a}%)")

    if not advantages:
        advantages.append("Both candidates have matching overall qualifications.")

    return advantages

def comparison_recommendation(
    winner
):
    if winner == "Tie":
        return "Both candidates are equally suitable."
    return f"{winner} is the stronger fit for the role."