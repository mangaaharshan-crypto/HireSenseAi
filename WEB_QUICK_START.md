# HireSense AI Web Application - Quick Start

## Launch the Complete Application

### Step 1: Start Backend (Terminal 1)

```bash
cd backend
export PATH="/home/appuser/.local/bin:$PATH"
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000

### Step 2: Start Web App (Terminal 2)

```bash
cd web
npm run dev
```

Web app runs at: http://localhost:5173

### Step 3: Use the Application

1. Open http://localhost:5173 in your browser
2. Click "Get Started" or "Sign Up"
3. Create an account or sign in
4. Select a job role
5. Upload a resume (PDF/DOCX)
6. Answer AI-generated interview questions
7. View comprehensive assessment results

## What You'll See

### Landing Page
- Professional hero section
- Feature highlights
- How it works section
- Call-to-action buttons

### Assessment Flow
1. **Role Selection** - Choose from preset roles or create custom
2. **Resume Upload** - Drag & drop or click to upload
3. **AI Interview** - Answer 3-5 tailored questions
4. **Results** - View scores (technical, clarity, authenticity) and recommendation

## Features

- Modern dark theme with gradients
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Real-time progress tracking
- Comprehensive feedback system
- User authentication with JWT

## Configuration

The web app connects to the backend at `http://localhost:8000` by default.

To change this, edit `web/.env`:

```env
VITE_API_BASE=http://localhost:8000
```

## Production Build

Build for deployment:

```bash
cd web
npm run build
```

The optimized files will be in the `web/dist` folder.

## Troubleshooting

**Issue: Web app can't connect to backend**
- Ensure backend is running on port 8000
- Check browser console for errors
- Verify `.env` has correct API URL

**Issue: Build fails**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

**Issue: Styles not loading**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for CSS errors

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with CSS variables
- **State**: React Context API
- **Backend**: FastAPI + Gemini API

## Next Steps

- Customize colors in `src/index.css`
- Add your logo to `public/`
- Update meta tags in `index.html`
- Deploy to Netlify, Vercel, or your hosting platform
