# Signal — Air-Gapped P2P Emergency Mesh Net

Signal is a hyper-resilient, offline-first, peer-to-peer emergency communication tool built for situations where cell towers and the internet are completely disabled. By utilizing completely air-gapped signaling via QR codes, it establishes direct WebRTC connections between Desktop and Mobile devices without ever needing a central server or local network infrastructure for the initial handshake.

---

## Technical Architecture

Signal is a unified cross-platform system featuring a **React/Electron Desktop app** and a **React Native (Expo) Mobile app**. It completely bypasses traditional mDNS and WebSocket signaling in favor of a zero-infrastructure QR-code approach:

1. **Air-Gapped Signaling**: Initial connection establishment (SDP offers/answers) is performed entirely offline. Desktop applications generate Animated QR Codes mapping out base64 encoded, chunked WebRTC Session Descriptions.
2. **Mobile Camera Scanning**: The React Native mobile app uses its camera to scan and reconstruct these chunked payloads, bypassing buffer constraints and allowing massive SDP payloads to be sent over thin air.
3. **P2P Channels**: WebRTC DataChannels are instantiated natively on both Electron (`RTCPeerConnection` via Chromium) and React Native (`react-native-webrtc`) to form the peer-to-peer backbone.
4. **Offline Database**: Both desktop and mobile clients maintain a local SQLite/JSON store-and-forward queue to persist messages when nodes drop out of the mesh.
5. **E2E Encryption**: Direct messages are secured using WebCrypto API bindings (`globalThis.crypto.subtle`).
6. **Optimized Size**: The entire codebase has been minified and stripped of comments to reduce overall size.

---

## Installation & Build Instructions

### Prerequisites
- Node.js (v18 or v20 recommended)
- Windows OS (to package the portable Desktop `.exe`)
- Android SDK & Gradle (to package the Mobile `.apk`)

### 1. Build the Desktop Executable (Windows)
To install dependencies, bundle the React frontend, and package the Windows application, run:
```bash
# Install dependencies
npm install

# Build and package the portable executable folder
npm run build
```
Once the build completes, the standalone executable folder will be located in:
`dist-build/Signum-win32-x64/` (run `Signal.exe` inside it).

### 2. Build the Mobile App (Android APK)
To build the native Android application locally (bypassing Expo cloud servers):
```bash
cd mobile
npm install

# Prebuild the native Android directory
npx expo prebuild --clean

# Compile the native C++ libraries and generate the APK
cd android
./gradlew assembleRelease
```
The optimized release APK will be located at:
`mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## Usage Guide (Establishing an Air-Gapped Connection)

1. **Desktop Initialization**: 
   - Launch the Desktop executable. 
   - Enter your username.
   - Click "Create Offer". The desktop app will generate an SDP offer and display it as an Animated QR Code on the screen.
   
2. **Mobile Handshake**:
   - Install the `.apk` on your Android device and launch the app.
   - Enter your username.
   - Open the "Scan QR" feature and point the camera at the Desktop's animated QR code.
   - The mobile device reconstructs the chunks and generates an SDP Answer.
   
3. **Reverse Handshake**:
   - The Mobile device will now present its own generated WebRTC Answer.
   - Copy this Answer payload back into the Desktop application's input field and submit it.
   
4. **Connection Established**:
   - A direct, high-speed WebRTC DataChannel is now open between the two devices. You can now chat and exchange data fully peer-to-peer!
