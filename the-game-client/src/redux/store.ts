'use client';

import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

type AppState = {
  user: User | null;
};

function loadFromLocalStorage(): AppState | null {
  try {
    const serialisedState = localStorage.getItem('persistantState');
    if (serialisedState === null) return null;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function saveToLocalStorage(state: AppState) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem('persistantState', serialisedState);
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
  },
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
