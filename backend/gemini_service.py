"""
HireSense AI - Gemini-powered resume analysis, question generation, and answer scoring.
"""
import json
import re
import google.generativeai as genai
from config import settings
from models import ResumeAnalysis, AnswerScore

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)
MODEL_NAME = "models/gemini-pro"


def _get_model():
    # Mock mode - API key not working
    return None


def _parse_json_block(text: str) -> dict:
    """Extract JSON from markdown code block or raw JSON."""
    text = text.strip()
    # Remove ```json ... ``` wrapper if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()
    return json.loads(text)


async def analyze_resume_with_gemini(raw_text: str) -> ResumeAnalysis:
    """Extract skills, experience, education, projects and compute resume score using Gemini."""
    # Mock response - Gemini API not available
    return ResumeAnalysis(
        skills=["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
        experience=["Senior Software Engineer at Tech Solutions Inc. (2021-Present)", "Software Engineer at Digital Innovations LLC (2019-2020)"],
        education=["Bachelor of Science in Computer Science - University of Technology (2017)"],
        projects=["E-Commerce Platform", "Task Management App"],
        raw_text=raw_text[:2000],
        resume_score=85.0,
    )


async def generate_questions_with_gemini(role: str, resume_data: dict) -> list[str]:
    """Generate 3-5 interview questions for the given role and resume using Gemini."""
    # Mock questions
    return [
        f"What experience do you have with {role} responsibilities?",
        "Can you describe a challenging project you worked on?",
        "What are your key technical strengths?",
        "How do you stay updated with industry trends?",
        "Why are you interested in this role?"
    ]
    if not settings.gemini_api_key:
        return [
            f"Tell us about your experience relevant to {role}.",
            "Describe a challenging project and how you approached it.",
            "What are your key strengths for this role?",
        ]
    skills = resume_data.get("skills", [])
    experience = resume_data.get("experience", [])
    education = resume_data.get("education", [])
    projects = resume_data.get("projects", [])

    prompt = f"""You are an expert interviewer. Generate exactly 4 interview questions for the role: "{role}".

Candidate background (from resume):
- Skills: {skills}
- Experience: {experience}
- Education: {education}
- Projects: {projects}

Requirements:
- Mix behavioral and role-specific questions.
- Questions should be open-ended and allow 1-2 minute answers.
- Return a JSON object with a single key "questions" whose value is an array of exactly 4 question strings. No other text."""

    model = _get_model()
    response = model.generate_content(prompt)
    try:
        data = _parse_json_block(response.text)
        questions = data.get("questions", [])
        if isinstance(questions, list) and len(questions) >= 3:
            return questions[:5]
    except (json.JSONDecodeError, KeyError):
        pass
    return [
        f"Tell us about your experience relevant to {role}.",
        "Describe a challenging project and how you approached it.",
        "What are your key strengths for this role?",
    ]


async def analyze_answers_with_gemini(
    questions: list[str], answers: list[str], role: str, resume_score: float | None = None
) -> dict:
    """Score each answer and return overall scores - MOCK VERSION."""
    return _default_analyze_response(questions, answers, resume_score)

    qa_pairs = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(questions, answers)])
    prompt = f"""You are an expert hiring analyst. For each Q&A below, score the candidate's answers.

Role: {role}

Q&A pairs:
{qa_pairs}

For each answer provide:
1. technical_score (0-100): relevance and depth for the role
2. clarity_score (0-100): coherence and communication
3. authenticity_score (0-100): how natural and human the answer sounds; 100 = clearly human, 0 = likely AI-generated or generic
4. feedback: one short sentence

Also provide overall:
- interview_technical: average technical (0-100)
- interview_clarity: average clarity (0-100)
- interview_authenticity: average authenticity (0-100)
- recommendation: exactly one of "Reject", "Consider", "Shortlist"

Return only a single JSON object with this structure (no markdown):
{{
  "per_answer": [
    {{ "technical_score": 70, "clarity_score": 80, "authenticity_score": 85, "feedback": "..." }}
  ],
  "interview_technical": 72,
  "interview_clarity": 78,
  "interview_authenticity": 82,
  "recommendation": "Consider"
}}"""

    model = _get_model()
    response = model.generate_content(prompt)
    try:
        data = _parse_json_block(response.text)
        per_answer = data.get("per_answer", [])
        while len(per_answer) < len(answers):
            per_answer.append({
                "technical_score": 50,
                "clarity_score": 50,
                "authenticity_score": 50,
                "feedback": "No analysis available.",
            })
        per_scores = [
            AnswerScore(
                technical_score=float(p.get("technical_score", 50)),
                clarity_score=float(p.get("clarity_score", 50)),
                authenticity_score=float(p.get("authenticity_score", 50)),
                feedback=p.get("feedback"),
            )
            for p in per_answer[: len(answers)]
        ]
        tech = float(data.get("interview_technical", 50))
        clarity = float(data.get("interview_clarity", 50))
        auth = float(data.get("interview_authenticity", 50))
        recommendation = str(data.get("recommendation", "Consider")).strip()
        if recommendation not in ("Reject", "Consider", "Shortlist"):
            recommendation = "Consider"
        interview_score = (tech + clarity + auth) / 3.0
        # Final score: combine resume (if provided), interview, and authenticity
        if resume_score is not None:
            final_score = 0.35 * resume_score + 0.45 * interview_score + 0.2 * auth
        else:
            final_score = 0.7 * interview_score + 0.3 * auth
        final_score = min(100, max(0, final_score))

        return {
            "per_answer_scores": per_scores,
            "technical_score": tech,
            "clarity_score": clarity,
            "authenticity_score": auth,
            "interview_score": round(interview_score, 1),
            "final_score": round(final_score, 1),
            "recommendation": recommendation,
        }
    except (json.JSONDecodeError, KeyError, TypeError):
        return _default_analyze_response(questions, answers, resume_score)


def _default_analyze_response(
    questions: list[str], answers: list[str], resume_score: float | None = None
) -> dict:
    per = [
        AnswerScore(technical_score=50, clarity_score=50, authenticity_score=50, feedback="Analysis unavailable.")
        for _ in answers
    ]
    inter = 50.0
    if resume_score is not None:
        final = 0.35 * resume_score + 0.45 * inter + 0.2 * 50
    else:
        final = 50.0
    return {
        "per_answer_scores": per,
        "technical_score": 50,
        "clarity_score": 50,
        "authenticity_score": 50,
        "interview_score": inter,
        "final_score": round(min(100, max(0, final)), 1),
        "recommendation": "Consider",
    }
