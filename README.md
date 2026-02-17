# HireSense AI

AI-powered hiring assessment: resume screening, role-based interview questions, and candidate scoring (with authenticity detection). Built with **FastAPI + Gemini** (backend) and **Expo / React Native** (mobile for Android & iOS).

## Quick start

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Set GEMINI_API_KEY in .env (copy from .env.example)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
API docs: http://localhost:8000/docs

### 2. Mobile app
```bash
cd mobile
npm install
# Optional: set your machine IP in mobile/lib/api.js for physical device
npx expo start
```
Then press **a** (Android) or **i** (iOS), or scan the QR code with Expo Go.

## Project structure

| Folder    | Description                    |
|-----------|--------------------------------|
| `backend/`| FastAPI + Gemini API           |
| `mobile/` | Expo React Native app (Android & iOS) |

## App flow

1. **Sign in / Sign up** → 2. **Select role** (or “Other” + custom) → 3. **Upload resume** (PDF/DOCX) → 4. **Answer interview questions** → 5. **View result** (score + Reject / Consider / Shortlist)

## Building for stores

- **Android APK/AAB:** See `mobile/README.md` – use EAS Build (`eas build -p android`).
- **iOS:** See `mobile/README.md` – use EAS Build (`eas build -p ios`); requires Apple Developer account.

Replace placeholder app icon and splash in `mobile/assets/` with your HireSense AI logo before release.
