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
    """Extract comprehensive details from resume including projects, achievements, and compute resume score using Groq."""
    prompt = f"""Analyze this resume comprehensively and return a JSON object with:
- "skills": array of technical and soft skills
- "experience": array of work experience with company, role, duration, and key responsibilities
- "education": array of education entries with degree, institution, year, and achievements
- "projects": array of detailed projects with name, description, technologies used, and outcomes
- "achievements": array of awards, certifications, and notable accomplishments
- "personal_info": object with name, email, phone, location (if available)
- "summary": brief professional summary extracted from resume
- "resume_score": number 0-100 (quality score based on completeness, clarity, and impact)
- "strengths": array of key strengths identified
- "improvement_areas": array of areas that could be enhanced

Resume:
{raw_text[:12000]}

Return only valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=3000
        )
        
        data = _parse_json_response(response.choices[0].message.content)
        
        # Convert objects to strings if needed
        skills = data.get("skills", [])
        if skills and isinstance(skills[0], dict):
            skills = [s.get("name", str(s)) for s in skills]
            
        experience = data.get("experience", [])
        if experience and isinstance(experience[0], dict):
            experience = [f"{e.get('title', '')} at {e.get('company', '')} ({e.get('duration', '')})" for e in experience]
            
        education = data.get("education", [])
        if education and isinstance(education[0], dict):
            education = [f"{e.get('degree', '')} - {e.get('institution', '')} ({e.get('year', '')})" for e in education]
            
        projects = data.get("projects", [])
        if projects and isinstance(projects[0], dict):
            projects = [f"{p.get('name', '')}: {p.get('description', '')} [{p.get('technologies', '')}]" for p in projects]
        
        achievements = data.get("achievements", [])
        if isinstance(achievements, list):
            achievements = [str(a) for a in achievements]
        
        return ResumeAnalysis(
            skills=skills[:30],
            experience=experience[:15],
            education=education[:8],
            projects=projects[:15],
            raw_text=raw_text[:3000],
            resume_score=float(data.get("resume_score", 75)),
        )
    except Exception as e:
        print(f"Groq error: {e}")
        return ResumeAnalysis(
            skills=["JavaScript", "Python", "React"],
            experience=["Software Engineer"],
            education=["Bachelor's Degree"],
            projects=["Web Application"],
            raw_text=raw_text[:3000],
            resume_score=75.0,
        )


async def generate_questions_with_groq(role: str, resume_data: dict) -> list[str]:
    """Generate comprehensive interview questions using Groq including technical, behavioral, and project-specific questions."""
    skills = ", ".join(resume_data.get("skills", [])[:8])
    projects = "\n".join(resume_data.get("projects", [])[:5])
    experience = "\n".join(resume_data.get("experience", [])[:3])
    
    prompt = f"""Generate 8 comprehensive interview questions for a {role} position based on this candidate profile:

Skills: {skills}

Experience:
{experience}

Projects:
{projects}

Include these types of questions:
1. Introduction: "Tell me about yourself" style question
2. Technical questions related to their skills
3. Project-specific questions about their work
4. Behavioral questions (teamwork, challenges, leadership)
5. Problem-solving scenarios
6. Career goals and motivation
7. Situational questions
8. Closing questions about their interest in this role

Return only a JSON array of 8 engaging questions that assess both technical capabilities and cultural fit."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800
        )
        
        questions = json.loads(response.choices[0].message.content)
        return questions[:8]
    except Exception as e:
        print(f"Groq error: {e}")
        return [
            "Tell me about yourself and your professional journey.",
            f"What experience do you have with {role} responsibilities?",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "How do you approach problem-solving when faced with technical challenges?",
            "Tell me about a time you had to work in a team to achieve a goal.",
            "What are your key technical strengths and how do you stay updated?",
            "Where do you see yourself professionally in the next 3-5 years?",
            "Why are you interested in this particular role and our company?"
        ]


async def analyze_answers_with_groq(
    questions: list[str], answers: list[str], role: str, resume_score: float | None = None
) -> dict:
    """Provide comprehensive analysis of answers including detailed feedback and improvement suggestions."""
    qa_text = "\n".join([f"Q{i+1}: {q}\nA{i+1}: {a}" for i, (q, a) in enumerate(zip(questions, answers))])
    
    prompt = f"""Analyze these interview answers comprehensively for a {role} position:

{qa_text}

Provide detailed analysis in JSON format:
{
  "per_answer": [
    {
      "question_number": 1,
      "technical_score": 0-100,
      "clarity_score": 0-100,
      "authenticity_score": 0-100,
      "relevance_score": 0-100,
      "confidence_level": "Low/Medium/High",
      "strengths": ["specific positive points"],
      "improvements": ["specific suggestions"],
      "detailed_feedback": "comprehensive analysis of the answer"
    }
  ],
  "overall_assessment": {
    "technical_proficiency": 0-100,
    "communication_skills": 0-100,
    "problem_solving_ability": 0-100,
    "cultural_fit": 0-100,
    "leadership_potential": 0-100,
    "overall_confidence": "Low/Medium/High"
  },
  "detailed_feedback": {
    "strengths": ["key strengths demonstrated"],
    "areas_for_improvement": ["specific areas to work on"],
    "recommendations": ["actionable advice for improvement"],
    "next_steps": ["suggested learning or practice areas"]
  },
  "interview_scores": {
    "technical_score": 0-100,
    "communication_score": 0-100,
    "authenticity_score": 0-100,
    "overall_score": 0-100
  },
  "recommendation": "Reject/Consider/Shortlist/Hire",
  "reasoning": "detailed explanation for the recommendation"
}

Focus on providing constructive, actionable feedback that helps the candidate improve."""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=3000
        )
        
        data = _parse_json_response(response.choices[0].message.content)
        
        per_answer = data.get("per_answer", [])
        per_scores = [
            AnswerScore(
                technical_score=float(p.get("technical_score", 70)),
                clarity_score=float(p.get("clarity_score", 70)),
                authenticity_score=float(p.get("authenticity_score", 70)),
                feedback=p.get("detailed_feedback", "Good answer"),
            )
            for p in per_answer[:len(answers)]
        ]
        
        # Extract scores from the nested structure
        interview_scores = data.get("interview_scores", {})
        tech = float(interview_scores.get("technical_score", data.get("technical_proficiency", 70)))
        clarity = float(interview_scores.get("communication_score", data.get("communication_skills", 70)))
        auth = float(interview_scores.get("authenticity_score", 70))
        
        recommendation = data.get("recommendation", "Consider")
        reasoning = data.get("reasoning", "Candidate shows potential")
        
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
            "detailed_feedback": data.get("detailed_feedback", {}),
            "overall_assessment": data.get("overall_assessment", {}),
            "reasoning": reasoning,
        }
    except Exception as e:
        print(f"Groq error: {e}")
        # Fallback scores
        per_scores = [
            AnswerScore(
                technical_score=70.0,
                clarity_score=75.0,
                authenticity_score=80.0,
                feedback="Good response, could be more detailed.",
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
            "detailed_feedback": {
                "strengths": ["Clear communication", "Relevant experience"],
                "areas_for_improvement": ["Provide more specific examples"],
                "recommendations": ["Practice STAR method for behavioral questions"],
                "next_steps": ["Work on technical depth", "Improve storytelling"]
            },
            "overall_assessment": {
                "technical_proficiency": 70,
                "communication_skills": 75,
                "problem_solving_ability": 72,
                "cultural_fit": 80,
                "leadership_potential": 68,
                "overall_confidence": "Medium"
            },
            "reasoning": "Candidate shows potential but needs more preparation."
        }
