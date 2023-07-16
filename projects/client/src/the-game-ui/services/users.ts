import { User } from '@the-game/ui/models';

import { api } from './api';

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserEntity: build.query<Readonly<User>, string>({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}`,
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: Readonly<User> }).data,
    }),
    getUsers: build.query<ReadonlyArray<User>, { name: string } | undefined>({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: (config: Readonly<{ name: string }> | undefined) =>
        config?.name ? `users?name=${config.name}` : 'users',
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: ReadonlyArray<User> }).data,
    }),
  }),
});

export const { useGetUserEntityQuery, useGetUsersQuery } = usersApi;

export const {
  endpoints: { getUsers },
} = usersApi;
