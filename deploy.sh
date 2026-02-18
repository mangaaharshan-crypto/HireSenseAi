#!/bin/bash

# HireSense AI - GitHub Deployment Script

echo "🚀 Starting HireSense AI Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the HireSenseAi root directory"
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
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

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/mangaaharshan-crypto/HireSenseAi.git
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "⚠️  Vercel CLI not found. Install with: npm install -g vercel"
    echo "Then run: vercel --prod"
fi

echo "✅ Deployment complete!"
echo "📱 Your app should be live at: https://hiresense-ai.vercel.app"
echo "📚 API docs at: https://hiresense-ai.vercel.app/docs"
