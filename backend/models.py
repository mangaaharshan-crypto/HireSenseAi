from pydantic import BaseModel, EmailStr
from typing import Optional, List


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


class ResumeAnalysis(BaseModel):
    skills: List[str]
    experience: List[str]
    education: List[str]
    projects: List[str]
    raw_text: Optional[str] = None
    resume_score: float  # 0-100


class GenerateQuestionsRequest(BaseModel):
    role: str
    resume_data: dict  # skills, experience, education, projects


class GenerateQuestionsResponse(BaseModel):
    questions: List[str]


class AnalyzeAnswersRequest(BaseModel):
    answers: List[str]
    questions: List[str]
    role: str
    resume_score: Optional[float] = None  # 0-100, from upload-resume; combined into final_score


class AnswerScore(BaseModel):
    technical_score: float
    clarity_score: float
    authenticity_score: float  # higher = more human-like
    feedback: Optional[str] = None


class AnalyzeAnswersResponse(BaseModel):
    per_answer_scores: List[AnswerScore]
    technical_score: float
    clarity_score: float
    authenticity_score: float
    interview_score: float  # 0-100
    final_score: float  # 0-100 combined
    recommendation: str  # "Reject" | "Consider" | "Shortlist"
