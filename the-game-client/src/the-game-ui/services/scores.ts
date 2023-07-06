import { api } from './api';

export const scoresApi = api.injectEndpoints({
  endpoints: (build) => ({
    getScores: build.query<{ points: number }, string>({
      providesTags: () => [{ type: 'Scores' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}/scores`,
    }),
  }),
});

export const { useGetScoresQuery } = scoresApi;

export const {
  endpoints: { getScores },
} = scoresApi;
