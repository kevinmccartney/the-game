import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';
// import getConfig from 'next/config';

// type TheGameNextConfig = {
//   publicRuntimeConfig: { API_BASE_URL: string };
// };

// const { publicRuntimeConfig } = getConfig() as TheGameNextConfig;

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
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
  tagTypes: ['Users', 'Points', 'Scores', 'Notifications'],
});

export const enhancedApi = api;
// .enhanceEndpoints({
//   endpoints: () => ({
//     getPost: () => 'test',
//   }),
// });
