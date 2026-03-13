# SafeNest - Discreet Domestic Safety Assistant

SafeNest is a completely disguised, stealth-first web application designed to help individuals in domestic distress situations silently request help. Disguised as a typical utilities app (Calculator or Notes), it features a suite of hidden triggers that discretely switch the app into Emergency Mode.

## Advanced Evidence & Security Features

- **Automated Evidence Capture:**
  - Automatically records **60 seconds of audio** upon trigger.
  - Automatically captures a **5-second video** snapshot.
  - Attached directly to the incident log.
- **Secure Incident Dashboard:**
  - Access to incidents and settings is protected by an **App Passcode**.
  - **Intruder Selfie Trap**: Captures a photo using the front camera if the passcode is entered incorrectly twice.
  - **Security Timeline**: Merges emergency incidents with security events (like unauthorized access or app force-closes) into a single playback dashboard.
- **Drop / Throw Detection:**
  - High-acceleration physics detection to trigger an emergency if the device is dropped or thrown violently.
- **Failsafe App Closure:**
  - Logs a tamper event if the app is force-closed during an active emergency.

## Core Features

- **Disguised Interface**: Appears as a fully functional generic Notes or Calculator app.
- **Hidden Triggers**: 
  - **Secret Passcode**: Entered via the calculator.
  - **Shake/Drop Gesture**: Detects violent shaking or dropping using the DeviceMotion API.
  - **Tap Pattern**: Hidden screen tap sequences (e.g., 5 rapid taps).
- **Emergency Mode**: Automatically grabs GPS location, logs the incident, and simulates sending emergency SMS alerts to trusted contacts.
- **Safety Map & Laws**: Embedded map showing current location and nearest safety zones, plus a Women's Laws info card.
- **Fully Local MVP**: Uses localStorage to run smoothly offline and persistently with Base64 pseudo-encryption.

## Architecture & Tech Stack

- **Frontend**: React (18), Vite, Lucide-React, React-Leaflet
- **Backend**: Node.js, Express (For mock alert simulation and serving static files)
- **Deployment**: Configured to be run concurrently for easy MVP/Hackathon presentations.

## How to Run Locally

### Prerequisites
- Node.js (v16+)
- npm 

### Installation & Setup

1. **Install all dependencies**
   ```sh
   npm install
   ```

2. **Start the Development Server** (Frontend + Backend)
   ```sh
   npm run dev
   ```

3. **View the App**
   Open your browser to [http://localhost:5173](http://localhost:5173).

## Demo Instructions

1. Start the app for the first time. You will be greeted with the Onboarding flow.
2. Select your trigger type (e.g., Secret Passcode: "1234").
3. Set your **App Passcode** to protect sensitive data.
4. Add a mock trusted contact and enable Location/Recording features.
5. Reach the disguised app screen.
6. In the Calculator mode, type `1234` OR use your selected trigger (Shake/Tap/Drop).
7. **Emergency Mode** activates seamlessly. An overlay appears indicating location capturing, audio/video recording, and SMS dispatch.
8. Afterwards, navigate to the **Incident Log** (requires App Passcode) to view the timeline of the alert, play back captured media, and see intruder logs.
9. Explore the **Safety Map** and **Women's Laws** sections.

## Future Improvements

- Proper Database and Authentication (Firebase/Supabase)
- Real SMS Integration with Twilio API
- Real Video/Audio blob uploads to Cloud Storage (AWS S3)
- Native Mobile Packaging via React Native or Capacitor for background execution
