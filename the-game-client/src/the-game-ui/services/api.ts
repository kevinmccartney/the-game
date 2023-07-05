import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.the-game.kevinmccartney.dev/v1/',
  // prepareHeaders: prepareAuthHeaders,
  credentials: 'same-origin',
  fetchFn: async (request: any) => {
    const auth = getAuth();

    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();

      request.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(request.url, {
      method: request.method,
      credentials: 'same-origin',
      mode: 'cors',
      headers: request.headers,
    });
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Users', 'Points', 'Scores'],
  endpoints: () => ({}),
});

export const enhancedApi = api;
// .enhanceEndpoints({
//   endpoints: () => ({
//     getPost: () => 'test',
//   }),
// });
