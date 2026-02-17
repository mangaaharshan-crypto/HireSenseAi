"""
HireSense AI - FastAPI backend.
Uses Gemini API for resume analysis, question generation, and answer scoring.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_user_by_email,
    create_user,
    get_current_user,
)
from models import (
    UserCreate,
    UserLogin,
    Token,
    ResumeAnalysis,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    AnalyzeAnswersRequest,
    AnalyzeAnswersResponse,
)
from resume_parser import extract_resume_text
from gemini_service import (
    analyze_resume_with_gemini,
    generate_questions_with_gemini,
    analyze_answers_with_gemini,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="HireSense AI API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@app.get("/")
def home():
    return {"message": "HireSense AI API is running"}


def check_file_type(filename: str) -> bool:
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)


# ----- Auth -----
@app.post("/auth/signup", response_model=Token)
async def signup(data: UserCreate):
    existing = await get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(data.password)
    user = await create_user(data.email, hashed, data.full_name)
    token = create_access_token(
        {"sub": user["id"], "email": user["email"]}
    )
    return Token(
        access_token=token,
        user_id=user["id"],
        email=user["email"],
    )


@app.post("/auth/login", response_model=Token)
async def login(data: UserLogin):
    user = await get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(
        {"sub": user["id"], "email": user["email"]}
    )
    return Token(
        access_token=token,
        user_id=user["id"],
        email=user["email"],
    )


# ----- Resume upload -----
@app.post("/upload-resume", response_model=ResumeAnalysis)
async def upload_resume(
    file: UploadFile = File(...),
):
    if not file.filename or not check_file_type(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed",
        )
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10 MB
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")
    try:
        raw_text = extract_resume_text(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")
    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract enough text from the file")
    analysis = await analyze_resume_with_gemini(raw_text)
    return analysis


# ----- Generate questions -----
@app.post("/generate-questions", response_model=GenerateQuestionsResponse)
async def generate_questions(
    body: GenerateQuestionsRequest,
):
    questions = await generate_questions_with_gemini(body.role, body.resume_data)
    return GenerateQuestionsResponse(questions=questions)


# ----- Analyze answers -----
@app.post("/analyze-answers", response_model=AnalyzeAnswersResponse)
async def analyze_answers(
    body: AnalyzeAnswersRequest,
):
    if len(body.answers) != len(body.questions):
        raise HTTPException(
            status_code=400,
            detail="Number of answers must match number of questions",
        )
    result = await analyze_answers_with_gemini(
        body.questions,
        body.answers,
        body.role,
        resume_score=body.resume_score,
    )
    return AnalyzeAnswersResponse(**result)


@app.get("/health")
def health():
    return {"status": "ok"}
