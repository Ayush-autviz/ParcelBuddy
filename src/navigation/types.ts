export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: undefined;
  Suspended: undefined;
  Subscription: {
    returnTo?: string;
    returnScreen?: string;
    returnParams?: any;
    isUpgradeFlow?: boolean;
  } | undefined;
};
