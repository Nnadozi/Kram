# Kram
Your campus study network - Launching October 2025

# Installation and Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (version 14 or higher recommended)
- **npm** (comes with Node.js)

## Setup Steps

### 1. Clone the Repository
```bash
git clone [repository-url]
cd [project-directory]
```

### 2. Open in Visual Studio Code
```bash
code .
```
*Or open the project folder manually in VS Code*

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Development Server
```bash
npx expo start
```

### 5. Run the App on Your Device

1. **Install Expo Go** on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect your device:**
   - **iPhone:** Open the Camera app and scan the QR code displayed in your terminal/console
   - **Android:** Open the Expo Go app and scan the QR code

3. The app should load automatically on your device

## Troubleshooting

- Make sure your mobile device and computer are on the same Wi-Fi network
- If the QR code doesn't appear, try running `npx expo start --tunnel`
- For any dependency issues, try deleting `node_modules` and running `npm install` again