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

---

## Deploy to GitHub

Repo is already initialized with an initial commit. To push to GitHub:

1. **Create a new repository on GitHub**  
   Go to [github.com/new](https://github.com/new), name it e.g. `HireSenseAi`, leave it empty (no README, no .gitignore).

2. **Add remote and push** (replace `YOUR_USERNAME` and `HireSenseAi` with your GitHub username and repo name):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/HireSenseAi.git
   git branch -M main
   git push -u origin main
   ```

   Or with SSH:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/HireSenseAi.git
   git branch -M main
   git push -u origin main
   ```

**Note:** `backend/.env` is not committed (it contains your Gemini API key). After cloning elsewhere, copy `backend/.env.example` to `backend/.env` and add your key.
