# HireSense AI

AI-powered hiring assessment: resume screening, role-based interview questions, and candidate scoring (with authenticity detection). Built with **FastAPI + Gemini** (backend), **React Web App** (web), and **Expo / React Native** (mobile for Android & iOS).

## Quick start

### Prerequisites
1. Get your **Gemini API key** from: https://aistudio.google.com/apikey
2. Add it to `backend/.env` (replace the empty GEMINI_API_KEY value)

### 1. Backend
```bash
cd backend

# Install dependencies
python3 -m pip install --break-system-packages -r requirements.txt

# Start the server
export PATH="/home/appuser/.local/bin:$PATH"
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# OR use the start script:
./start.sh
```
API docs: http://localhost:8000/docs

### 2. Web app
```bash
cd web
npm install

# Start web dev server
npm run dev
```
Visit http://localhost:5173

### 3. Mobile app (optional)
```bash
cd mobile
npm install

# Start Expo
npx expo start

# OR use the start script:
./start.sh
```
Then press **a** (Android) or **i** (iOS), or scan the QR code with Expo Go.

**Mobile API Configuration:**
- **Android Emulator** (default): Already configured for `http://10.0.2.2:8000`
- **iOS Simulator**: Change API_BASE in `mobile/lib/api.js` to `http://localhost:8000`
- **Physical Device**: Change API_BASE to `http://YOUR_COMPUTER_IP:8000` (same WiFi)

## Project structure

| Folder    | Description                    |
|-----------|--------------------------------|
| `backend/`| FastAPI + Gemini API           |
| `web/`    | React web application (Vite)   |
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
