import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceResultItemData } from '../components';

type User = Record<string, any>;

interface Token {
  access_token?: string;
  refresh_token?: string;
}

// Define the state interface (only the data we want to persist)
interface AuthStateData {
  user: User | null;
  token: Token | null;
}

// Define the full state interface including methods
interface AuthState extends AuthStateData {
  setUser: (user: User) => void;
  setToken: (token: Token) => void;
  logout: () => void;
}

type AuthStorePersist = PersistOptions<AuthState, AuthStateData>

const persistConfig: AuthStorePersist = {
  name: 'driver-auth-storage',
  storage: {
    getItem: async (name) => {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  },
  partialize: (state) => ({
    user: state.user,
    token: state.token,
  }),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => {
        set({ user: null, token: null });
      }
      }),
    persistConfig
  )
);

// Search Screen Store - Only for from/to values
interface SearchFormStateData {
  from: string;
  to: string;
  selectedFrom: PlaceResultItemData | null;
  selectedTo: PlaceResultItemData | null;
  fromLatitude?: number;
  fromLongitude?: number;
  toLatitude?: number;
  toLongitude?: number;
}

interface SearchFormState extends SearchFormStateData {
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setSelectedFrom: (place: PlaceResultItemData | null) => void;
  setSelectedTo: (place: PlaceResultItemData | null) => void;
  setFromCoordinates: (latitude?: number, longitude?: number) => void;
  setToCoordinates: (latitude?: number, longitude?: number) => void;
  clearSearchForm: () => void;
}

type SearchFormStorePersist = PersistOptions<SearchFormState, SearchFormStateData>;

const searchFormPersistConfig: SearchFormStorePersist = {
  name: 'search-form-storage',
  storage: {
    getItem: async (name) => {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  },
  partialize: (state) => ({
    from: state.from,
    to: state.to,
    selectedFrom: state.selectedFrom,
    selectedTo: state.selectedTo,
    fromLatitude: state.fromLatitude,
    fromLongitude: state.fromLongitude,
    toLatitude: state.toLatitude,
    toLongitude: state.toLongitude,
  }),
};

export const useSearchFormStore = create<SearchFormState>()(
  persist(
    (set) => ({
      from: '',
      to: '',
      selectedFrom: null,
      selectedTo: null,
      fromLatitude: undefined,
      fromLongitude: undefined,
      toLatitude: undefined,
      toLongitude: undefined,
      setFrom: (from) => set({ from }),
      setTo: (to) => set({ to }),
      setSelectedFrom: (place) => set({ 
        selectedFrom: place,
        fromLatitude: place?.latitude,
        fromLongitude: place?.longitude,
      }),
      setSelectedTo: (place) => set({ 
        selectedTo: place,
        toLatitude: place?.latitude,
        toLongitude: place?.longitude,
      }),
      setFromCoordinates: (latitude, longitude) => set({ 
        fromLatitude: latitude, 
        fromLongitude: longitude 
      }),
      setToCoordinates: (latitude, longitude) => set({ 
        toLatitude: latitude, 
        toLongitude: longitude 
      }),
      clearSearchForm: () => set({
        from: '',
        to: '',
        selectedFrom: null,
        selectedTo: null,
        fromLatitude: undefined,
        fromLongitude: undefined,
        toLatitude: undefined,
        toLongitude: undefined,
      }),
    }),
    searchFormPersistConfig
  )
);

// Create Screen Store - Only for origin/destination values
interface CreateFormStateData {
  origin: string;
  destination: string;
  selectedOrigin: PlaceResultItemData | null;
  selectedDestination: PlaceResultItemData | null;
  originLatitude?: number;
  originLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
}

interface CreateFormState extends CreateFormStateData {
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setSelectedOrigin: (place: PlaceResultItemData | null) => void;
  setSelectedDestination: (place: PlaceResultItemData | null) => void;
  setOriginCoordinates: (latitude?: number, longitude?: number) => void;
  setDestinationCoordinates: (latitude?: number, longitude?: number) => void;
  clearCreateForm: () => void;
}

type CreateFormStorePersist = PersistOptions<CreateFormState, CreateFormStateData>;

const createFormPersistConfig: CreateFormStorePersist = {
  name: 'create-form-storage',
  storage: {
    getItem: async (name) => {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  },
  partialize: (state) => ({
    origin: state.origin,
    destination: state.destination,
    selectedOrigin: state.selectedOrigin,
    selectedDestination: state.selectedDestination,
    originLatitude: state.originLatitude,
    originLongitude: state.originLongitude,
    destinationLatitude: state.destinationLatitude,
    destinationLongitude: state.destinationLongitude,
  }),
};

export const useCreateFormStore = create<CreateFormState>()(
  persist(
    (set) => ({
      origin: '',
      destination: '',
      selectedOrigin: null,
      selectedDestination: null,
      originLatitude: undefined,
      originLongitude: undefined,
      destinationLatitude: undefined,
      destinationLongitude: undefined,
      setOrigin: (origin) => set({ origin }),
      setDestination: (destination) => set({ destination }),
      setSelectedOrigin: (place) => set({ 
        selectedOrigin: place,
        originLatitude: place?.latitude,
        originLongitude: place?.longitude,
      }),
      setSelectedDestination: (place) => set({ 
        selectedDestination: place,
        destinationLatitude: place?.latitude,
        destinationLongitude: place?.longitude,
      }),
      setOriginCoordinates: (latitude, longitude) => set({ 
        originLatitude: latitude, 
        originLongitude: longitude 
      }),
      setDestinationCoordinates: (latitude, longitude) => set({ 
        destinationLatitude: latitude, 
        destinationLongitude: longitude 
      }),
      clearCreateForm: () => set({
        origin: '',
        destination: '',
        selectedOrigin: null,
        selectedDestination: null,
        originLatitude: undefined,
        originLongitude: undefined,
        destinationLatitude: undefined,
        destinationLongitude: undefined,
      }),
    }),
    createFormPersistConfig
  )
);