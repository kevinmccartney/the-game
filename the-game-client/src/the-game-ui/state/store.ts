'use client';

import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

import { api } from '@the-game/ui/services/api';

type AppState = {
  user: User | null;
};

function loadFromLocalStorage(): AppState | null {
  try {
    const serializedState = localStorage.getItem('persistentState');
    if (serializedState === null) return null;
    return JSON.parse(serializedState) as AppState;
  } catch (e) {
    // TODO: log to cloud logs
    console.warn(e);
    return null;
  }
}

function saveToLocalStorage(state: Readonly<AppState>) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('persistentState', serializedState);
  } catch (e) {
    // TODO: log to cloud logs
    console.warn(e);
  }
}

const hydratedState = loadFromLocalStorage();

export const userSlice = createSlice({
  initialState: hydratedState ? hydratedState.user : null,
  name: 'user',
  reducers: {
    login_success: (state, action: Readonly<PayloadAction<User | null>>) =>
      action.payload,
  },
});

export const userSelector = (state: Readonly<AppState>) => state.user;

const store = configureStore({
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userSlice.reducer,
  },
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
