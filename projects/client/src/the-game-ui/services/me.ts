import { MePatchBody, User } from '@the-game/ui/models';

import { api } from './api';

export const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Readonly<User>, void>({
      providesTags: () => [{ type: 'Me' }], // TODO: look into providing ID
      query: () => `me`,
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: Readonly<User> }).data,
    }),
    patchMe: build.mutation<void, MePatchBody>({
      invalidatesTags: () => [{ type: 'Me' }], // TODO: look into providing ID
      query: (body) => ({
        body,
        method: 'PATCH',
        url: `me`,
      }),
    }),
  }),
});

export const { useGetMeQuery, usePatchMeMutation } = meApi;

export const {
  endpoints: { getMe, patchMe },
} = meApi;
