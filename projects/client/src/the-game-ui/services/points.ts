import { Point } from '@the-game/ui/models';

import { api } from './api';

export const pointsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPoints: build.query<Point[], string>({
      providesTags: () => [{ type: 'Points' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}/points`,
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as { data: Point[] }).data;
      },
    }),
    postPoints: build.mutation<void, { body: Partial<Point>; userId: string }>({
      invalidatesTags: ['Points'],
      query: (config) => ({
        body: config.body,
        method: 'POST',
        url: `users/${config.userId}/points`,
      }),
    }),
  }),
});

export const { useGetPointsQuery, usePostPointsMutation } = pointsApi;

export const {
  endpoints: { getPoints },
} = pointsApi;
