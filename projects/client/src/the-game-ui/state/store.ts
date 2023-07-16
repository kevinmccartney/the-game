'use client';

import { configureStore } from '@reduxjs/toolkit';

import { api } from '@the-game/ui/services/api';

// type Modal = {
//   isOpen: boolean;
// };

// type AppState = Readonly<{
//   // modal: Modal;
// }>;

// function loadFromLocalStorage(): AppState | null {
//   try {
//     const serializedState = localStorage.getItem('persistentState');
//     if (serializedState === null) return null;
//     return JSON.parse(serializedState) as AppState;
//   } catch (e) {
//     // TODO: log to cloud logs
//     console.warn(e);
//     return null;
//   }
// }

// function saveToLocalStorage(state: Readonly<AppState>) {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem('persistentState', serializedState);
//   } catch (e) {
//     // TODO: log to cloud logs
//     console.warn(e);
//   }
// }

// const hydratedState = loadFromLocalStorage();

// export const modalSlice = createSlice({
//   initialState: hydratedState ? hydratedState.modal : { isOpen: false },
//   name: 'user',
//   reducers: {
//     openModal: (state, action: Readonly<PayloadAction<Modal>>) =>
//       action.payload,
//   },
// });

// export const modalSelector = (state: Readonly<AppState>) => state.modal;

const store = configureStore({
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  reducer: {
    [api.reducerPath]: api.reducer,
    // modal: modalSlice.reducer,
  },
});

// store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
