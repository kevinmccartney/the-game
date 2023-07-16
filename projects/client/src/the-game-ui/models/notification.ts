export type NotificationType = 'user-onboarding';

export type Notification = {
  created_time: string;
  payload: Readonly<{
    [key: string]: any;
  }>;
  type: NotificationType;
  uid: string;
};
