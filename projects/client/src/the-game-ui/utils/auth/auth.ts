import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { NextRouter } from 'next/router';

export type RequestLoginParams = Readonly<{
  auth: Auth;
  provider: GoogleAuthProvider;
  router: NextRouter;
}>;

export type RequestLogoutParams = Readonly<{
  auth: Auth;
  router: NextRouter;
}>;

const requestLogin = async ({ auth, provider, router }: RequestLoginParams) => {
  try {
    await signInWithPopup(auth, provider);

    void router.push('/');
  } catch (error) {
    console.error(error);
  }
};

const requestLogout = async ({ auth, router }: RequestLogoutParams) => {
  try {
    await signOut(auth);

    void router.push('/');
  } catch (error) {
    console.error(error);
  }
};

export const loginClickHandler =
  ({ auth, provider, router }: RequestLoginParams) =>
  () =>
    void requestLogin({ auth, provider, router });

export const logoutClickHandler =
  ({ auth, router }: RequestLogoutParams) =>
  () =>
    void requestLogout({ auth, router });
