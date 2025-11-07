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
}

interface SearchFormState extends SearchFormStateData {
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setSelectedFrom: (place: PlaceResultItemData | null) => void;
  setSelectedTo: (place: PlaceResultItemData | null) => void;
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
  }),
};

export const useSearchFormStore = create<SearchFormState>()(
  persist(
    (set) => ({
      from: '',
      to: '',
      selectedFrom: null,
      selectedTo: null,
      setFrom: (from) => set({ from }),
      setTo: (to) => set({ to }),
      setSelectedFrom: (place) => set({ selectedFrom: place }),
      setSelectedTo: (place) => set({ selectedTo: place }),
      clearSearchForm: () => set({
        from: '',
        to: '',
        selectedFrom: null,
        selectedTo: null,
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
}

interface CreateFormState extends CreateFormStateData {
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setSelectedOrigin: (place: PlaceResultItemData | null) => void;
  setSelectedDestination: (place: PlaceResultItemData | null) => void;
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
  }),
};

export const useCreateFormStore = create<CreateFormState>()(
  persist(
    (set) => ({
      origin: '',
      destination: '',
      selectedOrigin: null,
      selectedDestination: null,
      setOrigin: (origin) => set({ origin }),
      setDestination: (destination) => set({ destination }),
      setSelectedOrigin: (place) => set({ selectedOrigin: place }),
      setSelectedDestination: (place) => set({ selectedDestination: place }),
      clearCreateForm: () => set({
        origin: '',
        destination: '',
        selectedOrigin: null,
        selectedDestination: null,
      }),
    }),
    createFormPersistConfig
  )
);