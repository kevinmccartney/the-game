import { Point } from '@the-game/client/the-game-ui/models';
import { api } from './api';

export const pointsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // addPost: build.mutation<Post, Partial<Post>>({
    //   query(body) {
    //     return {
    //       url: `posts`,
    //       method: 'POST',
    //       body,
    //     };
    //   },
    //   invalidatesTags: ['Posts'],
    // }),
    getPoints: build.query<Point[], string>({
      query: (id: string) => `users/${id}/points`,
      providesTags: (_result, _err, id) => [{ type: 'Points' }], // TOD: look into providing ID
    }),
    // updatePost: build.mutation<Post, Partial<Post>>({
    //   query(data) {
    //     const { id, ...body } = data;
    //     return {
    //       url: `posts/${id}`,
    //       method: 'PUT',
    //       body,
    //     };
    //   },
    //   invalidatesTags: (post) => [{ type: 'Posts', id: post?.id }],
    // }),
    // deletePost: build.mutation<{ success: boolean; id: number }, number>({
    //   query(id) {
    //     return {
    //       url: `posts/${id}`,
    //       method: 'DELETE',
    //     };
    //   },
    //   invalidatesTags: (post) => [{ type: 'Posts', id: post?.id }],
    // }),
  }),
});

export const { useGetPointsQuery } = pointsApi;

export const {
  endpoints: { getPoints },
} = pointsApi;
