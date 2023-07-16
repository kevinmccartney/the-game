import { Auth, signOut } from 'firebase/auth';
import { NextRouter } from 'next/router';

export type RequestLogoutParams = Readonly<{
  auth: Auth;
  router: NextRouter;
}>;

export const useRequestLogout = ({ auth, router }: RequestLogoutParams) => {
  const requestLogout = async () => {
    try {
      await signOut(auth);

      void router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return requestLogout;
};
