from pypdf import PdfReader
from docx import Document
import os

def extract_pdf_text(
    file_path
):

    reader = PdfReader(
        file_path
    )

    text = ""

    for page in reader.pages:

        text += (
            page.extract_text()
            or ""
        )

    return text

def extract_docx_text(
    file_path
):

    document = Document(file_path)

    paragraphs = []

    for para in document.paragraphs:

        paragraphs.append(
            para.text
        )

    return "\n".join(
        paragraphs
    )
    
def extract_txt_text(
    file_path
):

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return file.read()
    
def extract_text(
    file_path
):

    extension = (
        os.path.splitext(
            file_path
        )[1]
        .lower()
    )

    if extension == ".pdf":

        return extract_pdf_text(
            file_path
        )

    elif extension == ".docx":

        return extract_docx_text(
            file_path
        )

    elif extension == ".txt":

        return extract_txt_text(
            file_path
        )

    else:

        raise Exception(
            f"Unsupported file type: {extension}"
        )
        
    try:

        text = extract_text(
        file_path
        )

    except Exception as e:

        raise Exception(
            f"Resume Parsing Error: {str(e)}"
        )