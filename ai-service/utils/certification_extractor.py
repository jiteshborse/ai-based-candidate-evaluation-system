def extract_certifications(text):

    cert_keywords = [

        "certification",

        "certified",

        "aws",

        "azure",

        "google cloud",

        "oracle"
    ]

    found = []

    text_lower = text.lower()

    for cert in cert_keywords:

        if cert in text_lower:

            found.append(cert)

    return list(set(found))