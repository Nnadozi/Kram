const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  "expo": {
    "name": IS_DEV ? 'Kram Dev' : 'Kram',
    "slug": "Kram",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "kram",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "usesAppleSignIn": true,
      "bundleIdentifier": IS_DEV ? 'com.kram.dev' : 'com.kram.app',
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      },
      googleServicesFile: IS_DEV ? './GoogleService-Info(dev).plist' : './GoogleService-Info.plist'
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": IS_DEV ? 'com.kram.dev' : 'com.kram.app',
      googleServicesFile: IS_DEV ? './google-services(dev).json' : './google-services.json'
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "expo-web-browser",
      ["expo-apple-authentication"],
      ["@react-native-google-signin/google-signin"],
      [
        "expo-build-properties",
        {
          "ios": {
            useFrameworks: "static", 
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "0ebcb6fa-2aaf-4925-957b-292411967ca0"
      }
    }
  }
}
