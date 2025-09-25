const IS_DEV = process.env.APP_VARIANT === 'development';

import appJson from './app.json';

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    name: IS_DEV ? 'Kram (Dev)' : 'Kram',
    ios: {
      ...appJson.expo?.ios,
      bundleIdentifier: IS_DEV 
        ? 'com.kram.dev' 
        : 'com.kram.app',
      googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST || './GoogleService-Info.plist',
    },
    android: {
      ...appJson.expo?.android,
      package: IS_DEV 
        ? 'com.kram.dev' 
        : 'com.kram.app',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
  }
};

