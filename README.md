# React Native Health Survey App

This is a **React Native** project for a step-by-step health survey app, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Prerequisites

Before proceeding, ensure the following:

1. **Flask API Server**:
    - This app relies on a Flask API running locally on port `5000`.
    - Ensure the Flask server is set up and running before testing.

2. **ngrok Installation**:
    - This app uses ngrok to expose the local Flask server to the internet for testing release APKs.
    - Install ngrok by either:
        - Running:
          ```sh
          npm install -g ngrok
          ```
        - Or downloading it directly from [ngrok's website](https://ngrok.com/download).
    - Create a free account on ngrok and authenticate it by following ngrok's setup instructions.

## Why Localhost Doesn't Work in Release APKs

In release builds of Android and iOS:
- **Localhost (`127.0.0.1`)** refers to the device or emulator itself, not your development machine.
- Android and iOS do not allow direct access to localhost APIs unless properly configured with network routing.

To overcome this, we use ngrok to expose the local Flask server as a public URL that can be accessed by the release APK.

## Steps to Test Release APK with ngrok

### Step 1: Start Flask Server

Run the Flask server locally on your machine:
```sh
python app.py
```
Ensure it is running on `http://127.0.0.1:5000`.

### Step 2: Start ngrok

Expose the Flask server to the internet using ngrok:
```sh
ngrok http 5000
```
This will provide you with a public URL, such as:
```plaintext
Forwarding   https://<random-id>.ngrok.io -> http://127.0.0.1:5000
```
Copy the HTTPS URL (`https://<random-id>.ngrok.io`).

### Step 3: Update API Client

In your React Native project, update the API URL in your API client (e.g., `src/api/ApiClient.js`) with the ngrok URL:
```javascript
const API_URL = "https://<random-id>.ngrok.io/api"; // Replace with your ngrok URL
export default API_URL;
```

### Step 4: Generate a Release APK

1. Navigate to the `android/` directory:
   ```sh
   cd android
   ```
2. Build the release APK:
   ```sh
   ./gradlew assembleRelease
   ```
3. Locate the generated APK:
   ```plaintext
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Step 5: Install and Test the APK

#### For Android Emulator
1. Start your emulator using Android Studio or the command line.
2. Install the release APK:
   ```sh
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```
3. Launch the app on the emulator.

#### For Physical Devices
1. Transfer the APK to your device.
2. Install it by opening the APK file.
3. Ensure the device is connected to the same network as your machine.

### Step 6: Verify Connectivity
- Open the app and interact with it as usual.
- Use the ngrok public URL to ensure the app communicates with the local Flask server.

## Notes

1. **Temporary URL**:
    - The free-tier ngrok session expires after ~2 hours.
    - If the session expires, restart ngrok and update the API URL in your code.

2. **Cleartext Traffic Issues**:
    - Android release builds may block HTTP URLs. Always use the HTTPS URL provided by ngrok.

3. **Rebuild for URL Changes**:
    - Every time you restart ngrok and get a new URL, rebuild the APK with the updated API URL.

## Summary

1. Start the Flask server (`python app.py`).
2. Start ngrok (`ngrok http 5000`).
3. Update the API URL in your app with the ngrok URL.
4. Generate the release APK (`./gradlew assembleRelease`).
5. Install and test the APK on the emulator or device.

By following these steps, you can successfully test your release APK with a local Flask server using ngrok. 🚀
