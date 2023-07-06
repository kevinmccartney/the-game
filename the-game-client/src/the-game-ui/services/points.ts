import { Point } from '@the-game/ui/models';

import { api } from './api';

export const pointsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPoints: build.query<Point[], string>({
      providesTags: () => [{ type: 'Points' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}/points`,
    }),
  }),
});

export const { useGetPointsQuery } = pointsApi;

export const {
  endpoints: { getPoints },
} = pointsApi;
