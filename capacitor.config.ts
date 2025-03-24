import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.agecalculator',
  appName: 'AgeCalculator',
  webDir: 'dist',
  android: {
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
  }
};

export default config;
