
export type NavigationStyle = 'classic' | 'floating' | 'tabs' | 'none';

export interface AppConfig {
  websiteUrl: string;
  appName: string;
  packageName: string;
  version: string;
  targetSdk: string;
  themeColor: string;
  backgroundColor: string;
  navigationStyle: NavigationStyle;
  pullToRefresh: boolean;
  offlineSupport: boolean;
  pushNotifications: boolean;
  oneSignalId: string;
  adMobEnabled: boolean;
  adMobAppId: string;
  adMobBannerId: string;
  splashScreenText: string;
  displayMode: 'fullscreen' | 'standalone' | 'minimal-ui';
  // Signing Key info
  keystoreAlias: string;
  keystorePass: string;
  keyPass: string;
  useCustomSigning: boolean;
}

export type WizardStep = 'URL' | 'IDENTITY' | 'DESIGN' | 'ADVANCED' | 'SIGNING' | 'EXPORT';

// Defined AIResponse to match the schema expected from Gemini API
export interface AIResponse {
  suggestedName: string;
  suggestedDescription: string;
  suggestedPackage: string;
  suggestedColors: string[];
}
