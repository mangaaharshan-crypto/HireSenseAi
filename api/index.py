import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your existing modules
from main import app as main_app

# Configure for Vercel serverless
app = FastAPI(
    title="HireSense AI API - Vercel",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes from main app
app.mount("/api", main_app)

@app.get("/")
def root():
    return {"message": "HireSense AI API is running on Vercel"}

# For Vercel serverless deployment
handler = app
