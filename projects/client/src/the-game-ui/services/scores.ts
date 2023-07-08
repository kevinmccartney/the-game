import { api } from './api';

export const scoresApi = api.injectEndpoints({
  endpoints: (build) => ({
    getScores: build.query<number, string>({
      providesTags: () => [{ type: 'Scores' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}/scores`,
      transformResponse: (baseQueryReturnValue) =>
        (baseQueryReturnValue as { data: number }).data,
    }),
  }),
});

export const { useGetScoresQuery } = scoresApi;

export const {
  endpoints: { getScores },
} = scoresApi;
