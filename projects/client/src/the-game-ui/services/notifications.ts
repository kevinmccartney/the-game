import { Notification } from '@the-game/ui/models';

import { api } from './api';

export const notificationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], string>({
      providesTags: () => [{ type: 'Notifications' }], // TODO: look into providing ID
      query: (id: string) => `users/${id}/notifications`,
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as { data: Notification[] }).data;
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useLazyGetNotificationsQuery } =
  notificationApi;

export const {
  endpoints: { getNotifications },
} = notificationApi;
