# HireSense AI – Mobile App (Android & iOS)

React Native app built with **Expo** for both Google Play and App Store.

## Prerequisites

- Node.js 18+
- npm or yarn
- **Backend** running (see `../backend/README.md`) with `GEMINI_API_KEY` set
- For physical device testing: same Wi‑Fi as your machine, or use Android emulator / iOS simulator

## Setup

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Point the app to your API**
   - On **physical device**: set your computer’s IP in `lib/api.js`:
     ```js
     export const API_BASE = "http://192.168.1.5:8000";  // your machine IP
     ```
   - **Android emulator**: use `http://10.0.2.2:8000`
   - **iOS simulator**: `http://localhost:8000` is fine

3. **Start the app**
   ```bash
   npx expo start
   ```
   - Press `a` for Android or `i` for iOS, or scan the QR code with Expo Go.

## App flow

1. Splash → Login / Sign up  
2. Select role (including “Other” for custom role)  
3. Upload resume (PDF or DOCX)  
4. Answer AI-generated interview questions  
5. View result (score + Reject / Consider / Shortlist)

## App icon & splash

Replace the placeholders with your own assets:

- `assets/icon.png` – **1024×1024** (app icon)
- `assets/splash.png` – recommended **1284×2738** (splash)
- `assets/adaptive-icon.png` – **1024×1024** (Android adaptive icon)

Then run `npx expo prebuild --clean` if you need to regenerate native projects.

---

## Building for stores (EAS Build)

### 1. Install EAS CLI and log in

```bash
npm install -g eas-cli
eas login
```

### 2. Configure the project

```bash
eas build:configure
```

Use the default or create a new project when prompted.

### 3. Android (Google Play / APK)

**APK (for testing or sideload):**
```bash
eas build --platform android --profile preview
```

**AAB (for Play Store):**
```bash
eas build --platform android --profile production
```

After the build, download the `.aab` from the Expo dashboard and upload it to Google Play Console.

### 4. iOS (App Store)

**Requirements:** Apple Developer account ($99/year), Mac with Xcode for final submission (or use EAS Submit).

```bash
eas build --platform ios --profile production
```

First time: EAS will ask for Apple credentials and provisioning. After the build, use **EAS Submit** or upload the `.ipa` via Transporter/Xcode to App Store Connect.

### 5. Set API URL for production

Before building for production, set your live API URL in `lib/api.js`:

```js
export const API_BASE = "https://your-api-domain.com";
```

Then run the build again.

---

## Scripts

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm start`        | Start Expo dev server          |
| `npm run android`  | Run on Android                 |
| `npm run ios`      | Run on iOS                     |
| `eas build -p android` | Build Android (production) |
| `eas build -p ios`    | Build iOS (production)     |

## Privacy & Terms

In-app screens: **Privacy Policy** (`/privacy`) and **Terms & Conditions** (`/terms`). Update the content and contact emails before release.
