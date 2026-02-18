@echo off
REM HireSense AI - Windows Deployment Script

echo 🚀 Starting HireSense AI Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the HireSenseAi root directory
    pause
    exit /b 1
)

REM Initialize git if not already done
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git branch -M main
)

REM Add all files
echo 📁 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "🚀 Deploy HireSense AI - Advanced AI-Powered Hiring Platform

✨ Features:
- Comprehensive resume analysis with Groq AI
- 8-question interview suite (technical, behavioral, project-specific)
- Advanced feedback system with improvement suggestions
- Modern UI with HireSense AI branding
- Authentication and security features
- Vercel deployment ready

🔧 Tech Stack:
- Backend: FastAPI + Groq AI
- Frontend: React Native + Expo
- Database: SQLite
- Deployment: Vercel

🎯 AI Capabilities:
- Deep content extraction from PDFs/DOCX
- Personalized interview questions
- Multi-dimensional answer scoring
- Detailed feedback and recommendations"

REM Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Adding remote repository...
    git remote add origin https://github.com/mangaaharshan-crypto/HireSenseAi.git
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push -u origin main

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 📱 Your app should be live at: https://hiresense-ai.vercel.app
echo 📚 API docs at: https://hiresense-ai.vercel.app/docs
pause
