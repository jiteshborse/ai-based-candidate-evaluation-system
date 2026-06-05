import re

def extract_projects(text):

    project_keywords = [

        "project",

        "projects",

        "developed",

        "built",

        "implemented"
    ]

    projects = []

    lines = text.split("\n")

    for line in lines:

        for keyword in project_keywords:

            if keyword in line.lower():

                projects.append(
                    line.strip()
                )

    return projects[:10]