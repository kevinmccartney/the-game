import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
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
        request.method === 'POST' || request.method === 'PATCH'
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
  tagTypes: ['Users', 'Points', 'Scores', 'Notifications', 'Me'],
});
