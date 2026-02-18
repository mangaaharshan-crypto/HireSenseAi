# HireSense AI Website - Rebuild Guide

## Current Status

A professional React web application was built with:
- Landing page with hero, features, how-it-works sections
- Authentication (login/signup)
- Complete assessment flow (role, upload, interview, results)
- Privacy and terms pages
- Modern dark theme with gradients
- Fully responsive design

## Quick Rebuild (5 minutes)

The web application structure exists in `web/` with all dependencies installed.

### Step 1: Create Source Files

Run the following commands from the project root:

```bash
cd web

# Create directory structure
mkdir -p src/pages src/context src/lib

# Download the complete source code
# (See the detailed file creation commands below)
```

### Step 2: Copy Source Code

Due to a cleanup issue, source files need to be recreated. You have two options:

**Option A: Use the working backend and mobile app as reference**
- The mobile app in `mobile/` has identical functionality
- API client, contexts, and flow logic are the same
- Adapt React Native components to React web components

**Option B: Rebuild from specifications**

Key files needed in `web/src/`:

1. **main.jsx** - Entry point
2. **App.jsx** - Router setup with all routes
3. **index.css** - Global styles (dark theme, gradients)

4. **context/AuthContext.jsx** - Authentication state
5. **context/FlowContext.jsx** - Assessment flow state

6. **lib/api.js** - API client (fetch calls to backend)

7. **pages/Home.jsx + Home.css** - Landing page
8. **pages/Login.jsx + Auth.css** - Sign in
9. **pages/Signup.jsx + Auth.css** - Sign up  
10. **pages/Role.jsx + Role.css** - Role selection
11. **pages/Upload.jsx + Upload.css** - Resume upload
12. **pages/Interview.jsx + Interview.css** - AI interview
13. **pages/Result.jsx + Result.css** - Results display
14. **pages/Privacy.jsx + Legal.css** - Privacy policy
15. **pages/Terms.jsx + Legal.css** - Terms

### Step 3: Configure Environment

```bash
cd web
echo "VITE_API_BASE=http://localhost:8000" > .env
```

### Step 4: Update index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="HireSense AI - AI-powered hiring assessment" />
    <title>HireSense AI - Smart Hiring Made Simple</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 5: Build and Run

```bash
# Development
npm run dev

# Production build
npm run build
```

## Alternative: Fresh Start

If you prefer to start fresh with the complete codebase:

```bash
# From project root
cd web
npx create-vite@latest . --template react --force
npm install
npm install react-router-dom

# Then add all source files as specified above
```

## Design Specifications

### Color Scheme
- Background: #0f0f1a (dark)
- Card: #16213e
- Primary: #3b82f6 (blue)
- Accent: #a855f7 (purple)
- Text: #f8fafc
- Text Secondary: #94a3b8

### Key Features
- Gradient buttons and headings
- Card-based UI with hover effects
- Smooth animations (fadeInUp, transitions)
- Responsive grid layouts
- Progress bars for interview
- Circular score indicators for results

### Routes
- / - Landing page
- /login - Sign in
- /signup - Create account
- /role - Select job role
- /upload - Upload resume
- /interview - Answer questions
- /result - View assessment
- /privacy - Privacy policy
- /terms - Terms & conditions

## API Integration

The web app communicates with the FastAPI backend at `http://localhost:8000`:

- POST /auth/login
- POST /auth/signup
- POST /upload-resume (multipart/form-data)
- POST /generate-questions
- POST /analyze-answers

## Notes

- React 19 + Vite
- No UI framework dependencies (custom CSS)
- JWT authentication with localStorage
- File upload with FormData
- Context API for state management

The mobile app in `mobile/` directory has identical functionality and can serve as a complete reference for rebuilding the web version.
