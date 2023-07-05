import { api } from './api';

export const scoresApi = api.injectEndpoints({
  endpoints: (build) => ({
    getScores: build.query<{ points: number }, string>({
      query: (id: string) => `users/${id}/scores`,
      providesTags: (_result, _err, id) => [{ type: 'Scores' }], // TODO: look into providing ID
    }),
  }),
});

export const { useGetScoresQuery } = scoresApi;

export const {
  endpoints: { getScores },
} = scoresApi;
