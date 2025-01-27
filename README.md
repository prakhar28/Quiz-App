# React Native Health Survey App

This is a **React Native** project for a step-by-step health survey app, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Prerequisites

Before proceeding, ensure the following:

1. **Flask API Server**:
    - This app relies on a Flask API running locally on port `5000`.
    - Ensure the Flask server is set up and running before testing the APK.

2. **APK Installation**:
    - Install the provided APK on your Android device or emulator.
    - The APK is configured to communicate with the local server at `http://127.0.0.1:5000`.

### Start the Flask Server

1. Navigate to your Flask server project directory.
2. Run the following command:
   ```sh
   python app.py
   ```

By default, the Flask server should run on `http://127.0.0.1:5000`.

## Testing the APK

### Step 1: Install the APK

- Download the provided APK file to your Android device or emulator.
- Install the APK by following these steps:
    1. Transfer the APK to your device if necessary.
    2. Open the APK file to begin installation.
    3. Allow installation from unknown sources if prompted.

### Step 2: Verify Flask API Connectivity

Once the app starts, it will attempt to connect to the Flask API at `http://127.0.0.1:5000`. If the API is not reachable:

1. Ensure the Flask server is running.
2. Ensure the development environment supports network requests to `127.0.0.1`.
    - For testing on an Android emulator, use `http://10.0.2.2:5000` instead of `http://127.0.0.1:5000`.
    - If testing on a physical device, replace `127.0.0.1` with the machine's local IP address.

### Step 3: Run the Survey

1. Open the app and enter your username on the Welcome Screen.
2. Proceed through the questions one at a time.
3. At the end, view the completion report and restart the survey as needed.

## Key Features

- Step-by-step health survey with one question per screen.
- Local progress persistence using AsyncStorage.
- Smooth screen transitions.
- Backend integration with a Flask API for fetching questions and saving responses.

## Troubleshooting

- **Flask Server Not Responding**: Check if the server is running on port `5000` and the network connection is active.
- **API Connection Issues**:
    - For emulators, use `http://10.0.2.2:5000` to connect to the local machine.
    - For physical devices, ensure the local server is accessible over the network by using the machine's local IP.
- **App Issues**: Restart the app and ensure the server is running before starting the survey.

## Learn More

To learn more about React Native and related tools, take a look at the following resources:

- [React Native Documentation](https://reactnative.dev)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/installation/)

---
