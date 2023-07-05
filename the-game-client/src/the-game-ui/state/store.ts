'use client';

import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { api } from '@the-game/client/the-game-ui/services/api';
import { User } from 'firebase/auth';

type AppState = {
  user: User | null;
};

function loadFromLocalStorage(): AppState | null {
  try {
    const serializedState = localStorage.getItem('persistentState');
    if (serializedState === null) return null;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function saveToLocalStorage(state: AppState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('persistentState', serializedState);
  } catch (e) {
    console.warn(e);
  }
}

const hydratedState = loadFromLocalStorage();

export const userSlice = createSlice({
  name: 'user',
  initialState: hydratedState ? hydratedState.user : null,
  reducers: {
    login_success: (state, action: PayloadAction<User | null>) =>
      action.payload,
  },
});

export const userSelector = (state: any) => state.user;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
