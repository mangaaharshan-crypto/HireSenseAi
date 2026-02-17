# Launch Checklist - HireSense AI

## Before You Start

### Required:
- [ ] **Gemini API Key**: Get it from https://aistudio.google.com/apikey
- [ ] Add the API key to `backend/.env` file (line 3: GEMINI_API_KEY=your-key-here)

### System Requirements:
- [ ] Node.js 18+ installed
- [ ] Python 3.7+ installed
- [ ] Android Studio (for Android emulator) OR iOS Simulator (for Mac)
- [ ] Expo Go app (optional, for physical device testing)

## Launch Steps

### Step 1: Backend (Terminal 1)
```bash
cd backend
export PATH="/home/appuser/.local/bin:$PATH"
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Test it:** Open http://localhost:8000/docs in your browser

### Step 2: Mobile App (Terminal 2)
```bash
cd mobile
npx expo start
```

**Expected output:**
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Launch options:**
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go on your phone

## Configuration Check

### Mobile API Connection
Check `mobile/lib/api.js`:

```javascript
// Current setting (for Android emulator):
export const API_BASE = "http://10.0.2.2:8000";
```

**Change if needed:**
- iOS Simulator: `http://localhost:8000`
- Physical Device: `http://192.168.x.x:8000` (your computer's local IP)

## Troubleshooting

### Backend won't start
- Check if Python packages are installed: `python3 -m pip list | grep fastapi`
- Check if port 8000 is free: `lsof -i :8000`
- Verify GEMINI_API_KEY is set in backend/.env

### Mobile app can't connect to backend
- Ensure backend is running (check terminal 1)
- Verify API_BASE URL matches your setup
- Check firewall isn't blocking port 8000
- For physical device: ensure phone and computer are on same WiFi

### Dependencies issues
- Backend: `cd backend && python3 -m pip install --break-system-packages -r requirements.txt`
- Mobile: `cd mobile && npm install`

## Quick Commands

### Start Backend
```bash
cd backend && ./start.sh
```

### Start Mobile
```bash
cd mobile && ./start.sh
```

### Check if Backend is Running
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

## What to Expect

1. **Login Screen**: Create an account or sign in
2. **Role Selection**: Choose a job role (or custom)
3. **Upload Resume**: Select PDF or DOCX file
4. **Interview**: Answer 4 AI-generated questions
5. **Results**: View your scores and recommendation

## Important Notes

- Backend database (SQLite) will be created automatically on first run
- Resume files are analyzed using Google Gemini API
- Internet connection required for AI features
- First API call may take a few seconds

## Need Help?

Check the full documentation:
- `README.md` - Project overview
- `backend/README.md` - Backend details
- `mobile/README.md` - Mobile app details
- `START_APP.md` - Alternative startup guide
