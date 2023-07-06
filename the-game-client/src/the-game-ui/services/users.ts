import { User } from '@the-game/ui/models';

import { api } from './api';

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ReadonlyArray<User>, { name: string } | undefined>({
      providesTags: () => [{ type: 'Users' }], // TODO: look into providing ID
      query: (config: Readonly<{ name: string }> | undefined) =>
        config?.name ? `users?name=${config.name}` : 'users',
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

export const {
  endpoints: { getUsers },
} = usersApi;
