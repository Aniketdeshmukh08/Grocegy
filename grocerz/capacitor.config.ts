import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grocjimobileapp.app',
  appName: 'Grocji',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#dddddd",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
