import { AvailableRideData } from '../components/search/AvailableRideCard';

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
  AvailableRides: {
    rides?: AvailableRideData[];
    from: string;
    to: string;
    date: string;
    fromLatitude?: number;
    fromLongitude?: number;
    toLatitude?: number;
    toLongitude?: number;
  };
};
