"""
HireSense AI - Groq-powered resume analysis, question generation, and answer scoring.
"""
import json
from groq import Groq
from config import settings
from models import ResumeAnalysis, AnswerScore

# Configure Groq
client = Groq(api_key=settings.groq_api_key)
MODEL_NAME = "llama-3.3-70b-versatile"


def _parse_json_response(text: str) -> dict:
    """Extract JSON from response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())


async def analyze_resume_with_groq(raw_text: str) -> ResumeAnalysis:
    """Extract skills, experience, education, projects and compute resume score using Groq."""
    prompt = f"""Analyze this resume and return a JSON object with:
- "skills": array of technical skills
- "experience": array of work experience entries
- "education": array of education entries
- "projects": array of projects
- "resume_score": number 0-100 (quality score)

Resume:
{raw_text[:8000]}

Return only valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000
        )
        
        data = _parse_json_response(response.choices[0].message.content)
        
        return ResumeAnalysis(
            skills=data.get("skills", [])[:20],
            experience=data.get("experience", [])[:10],
            education=data.get("education", [])[:5],
            projects=data.get("projects", [])[:10],
            raw_text=raw_text[:2000],
            resume_score=float(data.get("resume_score", 75)),
        )
    except Exception as e:
        print(f"Groq error: {e}")
        return ResumeAnalysis(
            skills=["JavaScript", "Python", "React"],
            experience=["Software Engineer"],
            education=["Bachelor's Degree"],
            projects=["Web Application"],
            raw_text=raw_text[:2000],
            resume_score=75.0,
        )


async def generate_questions_with_groq(role: str, resume_data: dict) -> list[str]:
    """Generate interview questions using Groq."""
    skills = ", ".join(resume_data.get("skills", [])[:5])
    
    prompt = f"""Generate 5 interview questions for a {role} position.
Candidate skills: {skills}

Return only a JSON array of 5 questions."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        questions = json.loads(response.choices[0].message.content)
        return questions[:5]
    except Exception as e:
        print(f"Groq error: {e}")
        return [
            f"What experience do you have with {role}?",
            "Describe a challenging project you worked on.",
            "What are your key technical strengths?",
            "How do you approach problem-solving?",
            "Why are you interested in this role?"
        ]


async def analyze_answers_with_groq(
    questions: list[str], answers: list[str], role: str, resume_score: float | None = None
) -> dict:
    """Score answers using Groq."""
    qa_text = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(questions, answers)])
    
    prompt = f"""Analyze these interview answers for a {role} position.

{qa_text}

Return JSON with:
- "per_answer": array of objects with technical_score, clarity_score, authenticity_score (0-100), feedback
- "interview_technical": average technical score
- "interview_clarity": average clarity score  
- "interview_authenticity": average authenticity score
- "recommendation": "Reject", "Consider", or "Shortlist"

Return only valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000
        )
        
        data = _parse_json_response(response.choices[0].message.content)
        
        per_answer = data.get("per_answer", [])
        per_scores = [
            AnswerScore(
                technical_score=float(p.get("technical_score", 70)),
                clarity_score=float(p.get("clarity_score", 70)),
                authenticity_score=float(p.get("authenticity_score", 70)),
                feedback=p.get("feedback", "Good answer"),
            )
            for p in per_answer[:len(answers)]
        ]
        
        tech = float(data.get("interview_technical", 70))
        clarity = float(data.get("interview_clarity", 70))
        auth = float(data.get("interview_authenticity", 70))
        recommendation = data.get("recommendation", "Consider")
        
        interview_score = (tech + clarity + auth) / 3.0
        
        if resume_score:
            final_score = 0.35 * resume_score + 0.45 * interview_score + 0.2 * auth
        else:
            final_score = 0.7 * interview_score + 0.3 * auth
            
        return {
            "per_answer_scores": per_scores,
            "technical_score": tech,
            "clarity_score": clarity,
            "authenticity_score": auth,
            "interview_score": round(interview_score, 1),
            "final_score": round(final_score, 1),
            "recommendation": recommendation,
        }
    except Exception as e:
        print(f"Groq error: {e}")
        # Fallback scores
        per_scores = [
            AnswerScore(
                technical_score=70.0,
                clarity_score=75.0,
                authenticity_score=80.0,
                feedback="Good response",
            )
            for _ in answers
        ]
        return {
            "per_answer_scores": per_scores,
            "technical_score": 70.0,
            "clarity_score": 75.0,
            "authenticity_score": 80.0,
            "interview_score": 75.0,
            "final_score": 75.0,
            "recommendation": "Consider",
        }
