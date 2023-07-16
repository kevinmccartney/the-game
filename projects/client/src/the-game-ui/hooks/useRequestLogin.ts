import { Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NextRouter } from 'next/router';

import { useLazyGetNotificationsQuery } from '@the-game/ui/services/notifications';

export type RequestLoginParams = Readonly<{
  auth: Auth;
  provider: GoogleAuthProvider;
  router: NextRouter;
}>;

export const useRequestLogin = ({
  auth,
  provider,
  router,
}: RequestLoginParams) => {
  const [trigger] = useLazyGetNotificationsQuery();

  const requestLogin = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      const { data } = await trigger(user.user.uid);
      const hasOnboardingNotification = data
        ? data.map((x) => x.type).includes('user-onboarding')
        : false;

      if (hasOnboardingNotification) {
        console.log('has onboarding');
      }

      void router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return requestLogin;
};
