import { User } from '@the-game/ui/models';

import { api } from './api';

export const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Readonly<User>, void>({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: () => `me`,
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: Readonly<User> }).data,
    }),
  }),
});

export const { useGetMeQuery } = meApi;

export const {
  endpoints: { getMe },
} = meApi;
