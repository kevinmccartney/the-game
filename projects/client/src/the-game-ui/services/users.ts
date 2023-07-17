import { AnonymousUser } from '@the-game/ui/models';

import { api } from './api';

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserEntity: build.query<Readonly<AnonymousUser>, string>({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}`,
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: Readonly<AnonymousUser> }).data,
    }),
    getUsers: build.query<
      ReadonlyArray<AnonymousUser>,
      { name: string } | undefined
    >({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: (config: Readonly<{ name: string }> | undefined) =>
        config?.name ? `users?name=${config.name}` : 'users',
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: ReadonlyArray<AnonymousUser> }).data,
    }),
  }),
});

export const { useGetUserEntityQuery, useGetUsersQuery } = usersApi;

export const {
  endpoints: { getUsers },
} = usersApi;
