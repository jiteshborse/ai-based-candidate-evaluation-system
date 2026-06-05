import spacy
import re
import yake

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python",
    "java",
    "c++",
    "react",
    "node.js",
    "mongodb",
    "mysql",
    "docker",
    "aws",
    "kubernetes",
    "javascript"
]

def extract_skills(text):

    text_lower = text.lower()

    found = []

    for skill in SKILLS:

        if skill in text_lower:
            found.append(skill)

    return list(set(found))


def extract_keywords(text):

    extractor = yake.KeywordExtractor()

    keywords = extractor.extract_keywords(text)

    return [
        item[0]
        for item in keywords[:10]
    ]
    
def extract_education(text):

    education_keywords = [
        "mca",
        "bca",
        "b.tech",
        "m.tech",
        "bsc",
        "msc"
    ]

    text_lower = text.lower()

    result = []

    for edu in education_keywords:

        if edu in text_lower:
            result.append(edu.upper())

    return result

def extract_experience(text):

    matches = re.findall(
        r'(\d+)\+?\s+years',
        text.lower()
    )

    if matches:
        return int(matches[0])

    return 0