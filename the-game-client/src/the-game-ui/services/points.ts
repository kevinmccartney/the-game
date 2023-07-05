import { Point } from '@the-game/client/the-game-ui/models';
import { api } from './api';

export const pointsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPoints: build.query<Point[], string>({
      query: (id: string) => `users/${id}/points`,
      providesTags: (_result, _err, id) => [{ type: 'Points' }], // TODO: look into providing ID
    }),
  }),
});

export const { useGetPointsQuery } = pointsApi;

export const {
  endpoints: { getPoints },
} = pointsApi;
