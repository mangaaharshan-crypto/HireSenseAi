# HireSense AI - Advanced AI-Powered Hiring Platform

🚀 **Smart Hiring, Powered by AI**

## 🌟 Features

### 🧠 Advanced AI Analysis
- **Comprehensive Resume Analysis**: Deep extraction of skills, experience, projects, and achievements
- **8-Question Interview Suite**: Technical, behavioral, project-specific, and situational questions
- **Detailed Feedback System**: Multi-dimensional scoring with improvement suggestions
- **Real-time Answer Analysis**: Technical, clarity, authenticity, and relevance scoring

### 🎨 Professional UI/UX
- **Modern Design**: Gradient backgrounds, animations, and HireSense AI branding
- **Mobile-First**: Responsive design for all devices
- **Advanced Components**: Progress bars, score circles, detailed feedback cards
- **Indian Identity**: Logo with Ashoka Chakra and circuit board design

### 🔐 Authentication & Security
- **Secure Login/Signup**: JWT-based authentication
- **Protected Routes**: Role-based access control
- **Data Privacy**: Secure handling of personal information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Groq API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mangaaharshan-crypto/HireSenseAi.git
cd HireSenseAi
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

3. **Frontend Setup**
```bash
cd mobile
npm install
npm start
```

4. **Access the Application**
- **Mobile App**: http://localhost:8081
- **API Documentation**: http://localhost:8000/docs

## 🌐 Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
- `GROQ_API_KEY`: Your Groq API key
- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: Database connection string

## 📱 Features Overview

### 1. Resume Analysis
- Extracts skills, experience, education, projects
- Identifies achievements and strengths
- Provides improvement suggestions
- Scores resume quality (0-100)

### 2. Interview Questions
- Personalized based on resume content
- 8 comprehensive question types including technical, behavioral, and project-specific

### 3. Answer Evaluation
- Multi-dimensional scoring: Technical, Communication, Authenticity
- Detailed feedback for each answer
- Overall assessment with recommendations

### 4. Results Dashboard
- Visual score representation
- Progress bars for different skills
- Question-by-question analysis
- Actionable recommendations

## 🔧 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Groq**: Advanced AI model integration
- **SQLite**: Lightweight database
- **JWT**: Authentication tokens

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Expo Router**: Navigation and routing

## 🎯 AI Capabilities

### Resume Intelligence
- Content extraction and quality assessment
- Gap analysis and improvement identification
- Professional summary generation

### Interview Intelligence
- Personalized question generation
- Comprehensive coverage of skill areas
- Cultural fit evaluation

### Feedback Intelligence
- Constructive analysis and suggestions
- Skill gap identification
- Career guidance and next steps

---

**HireSense AI** - Transforming hiring with intelligent AI-powered analysis 🤖✨
