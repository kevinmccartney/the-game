import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.the-game.kevinmccartney.dev/v1/',
  // prepareHeaders: prepareAuthHeaders,
  credentials: 'same-origin',

  fetchFn: async (req: Readonly<RequestInfo>) => {
    const request = (req as Request).clone();
    const auth = getAuth();

    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();

      request?.headers.set('Authorization', `Bearer ${token}`);
    }

    const baseOptions: RequestInit = {
      credentials: 'same-origin',
      headers: request.headers,
      method: request.method,
      mode: 'cors',
    };

    if (request.body) {
      const body = (await request.json()) as BodyInit;

      return fetch(
        request?.url,
        request.method === 'POST'
          ? { ...baseOptions, body: JSON.stringify(body) }
          : baseOptions,
      );
    }

    return fetch(
      request?.url,
      request.method === 'POST'
        ? { ...baseOptions, body: request.body }
        : baseOptions,
    );
  },
});

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: ['Users', 'Points', 'Scores'],
});

export const enhancedApi = api;
// .enhanceEndpoints({
//   endpoints: () => ({
//     getPost: () => 'test',
//   }),
// });
