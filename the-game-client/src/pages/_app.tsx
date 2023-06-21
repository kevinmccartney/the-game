'use client';

import { useEffect, useState } from 'react';
import './globals.css';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { Provider, useDispatch } from 'react-redux';
import store, { userSlice } from '@the-game/client/redux/store';
import { Loading } from '@the-game/client/components';
import { useRouter } from 'next/router';

const provider = new GoogleAuthProvider();

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  // https://github.com/vercel/next.js/issues/5354#issuecomment-520305040
  // const hasWindow = () => {
  //   return typeof window !== 'undefined';
  // };

  // if (hasWindow()) {

  // }

  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      //  TODO: revisit this, might be a bit hacky
      if (!isInitialized) {
        const url = window.location.href;

        if (url.includes('index.html')) {
          window.location.href = url.replace('index.html', '');
        }

        var config = {
          apiKey: 'AIzaSyDurKKzRP9h_692StW7-SvcTpVZN0oCRE4',
          authDomain: 'the-game-388502.firebaseapp.com',
        };

        initializeApp(config);
        const auth = getAuth();

        await setPersistence(auth, browserLocalPersistence);

        setIsInitialized(true);
      }
    };

    initialize();

    const auth = getAuth();

    // onAuthStateChanged(auth, () => {
    //   router.push('/');
    // });
  });

  return (
    <Provider store={store}>
      {isInitialized ? <Component {...pageProps} /> : <Loading />}
    </Provider>
  );
}
