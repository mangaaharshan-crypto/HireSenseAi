# HireSense AI Backend (Gemini)

FastAPI backend using **Google Gemini API** for resume analysis, interview question generation, and answer scoring.

## Setup

1. **Create virtual environment and install dependencies**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate   # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set your **Gemini API key** in `.env`:
     ```
     GEMINI_API_KEY=your-gemini-api-key
     ```
   Get a key at [Google AI Studio](https://aistudio.google.com/apikey).

3. **Run the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

API docs: http://localhost:8000/docs
