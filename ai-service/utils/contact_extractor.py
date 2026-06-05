import re


def extract_email(text):
    emails = re.findall(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return emails[0] if emails else ""


def extract_phone(text):
    phones = re.findall(
        r"(\+?\d[\d\s\-]{8,15}\d)",
        text
    )

    return phones[0] if phones else ""
