# Quick Start Guide

## Prerequisites
1. Get your Gemini API key from: https://aistudio.google.com/apikey
2. Add it to `backend/.env` file (replace the empty GEMINI_API_KEY value)

## Start Backend
```bash
cd backend
export PATH="/home/appuser/.local/bin:$PATH"
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: http://localhost:8000
API docs: http://localhost:8000/docs

## Start Mobile App
Open a new terminal:
```bash
cd mobile
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

## Important Notes
- Mobile app is configured to connect to Android emulator (http://10.0.2.2:8000)
- For iOS simulator, change API_BASE in `mobile/lib/api.js` to `http://localhost:8000`
- For physical device, change API_BASE to `http://YOUR_COMPUTER_IP:8000` (must be on same WiFi)
- Backend requires GEMINI_API_KEY in `.env` file to work

## Troubleshooting
- If backend fails to start, ensure all dependencies are installed: `python3 -m pip install --break-system-packages -r requirements.txt`
- If mobile app can't connect, verify backend is running and API_BASE URL is correct
- Check that port 8000 is not blocked by firewall
