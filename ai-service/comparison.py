def overall_candidate_score(

    final_score,

    ats_score,

    confidence

):

    return round(

        (
            final_score * 0.60
        )

        +

        (
            ats_score * 0.20
        )

        +

        (
            confidence * 0.20
        ),

        2
    )
    
def determine_winner(

    candidate_a_score,

    candidate_b_score

):

    if candidate_a_score > candidate_b_score:

        return "Candidate A"

    elif candidate_b_score > candidate_a_score:

        return "Candidate B"

    return "Tie"

def compare_advantages(

    candidate_a,

    candidate_b

):

    advantages = []

    if (

        candidate_a["skillMatch"]

        >

        candidate_b["skillMatch"]

    ):

        advantages.append(
            "Higher skill match"
        )

    if (

        candidate_a["experienceScore"]

        >

        candidate_b["experienceScore"]

    ):

        advantages.append(
            "More relevant experience"
        )

    if (

        candidate_a["atsScore"]

        >

        candidate_b["atsScore"]

    ):

        advantages.append(
            "Better ATS score"
        )

    return advantages

def comparison_recommendation(
    winner
):

    if winner == "Tie":

        return (
            "Both candidates are equally suitable."
        )

    return (
        f"{winner} is the stronger fit for the role."
    )