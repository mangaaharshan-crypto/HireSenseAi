"""Extract raw text from PDF and DOCX resume files."""
import io
from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    text = []
    for page in reader.pages:
        text.append(page.extract_text() or "")
    return "\n".join(text).strip()


def extract_text_from_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs).strip()


def extract_resume_text(content: bytes, filename: str) -> str:
    name = (filename or "").lower()
    if name.endswith(".pdf"):
        return extract_text_from_pdf(content)
    if name.endswith(".docx"):
        return extract_text_from_docx(content)
    raise ValueError("Unsupported format. Use PDF or DOCX.")
