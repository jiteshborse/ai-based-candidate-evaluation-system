EDUCATION_KEYWORDS = [

    "mca",
    "bca",
    "b.tech",
    "m.tech",
    "bsc",
    "msc",
    "b.e",
    "mba"
]

def extract_education(text):

    result = []

    text_lower = text.lower()

    for item in EDUCATION_KEYWORDS:

        if item in text_lower:

            result.append(
                item.upper()
            )

    return list(set(result))