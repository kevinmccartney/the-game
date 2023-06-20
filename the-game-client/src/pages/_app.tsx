'use client';

import { useEffect } from 'react';
import './globals.css';

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  useEffect(() => {
    const script = document.createElement('script');

    script.innerHTML = `
      var config = {
        apiKey: "AIzaSyDurKKzRP9h_692StW7-SvcTpVZN0oCRE4",
        authDomain: "the-game-388502.firebaseapp.com",
      };
      firebase.initializeApp(config);
    `;

    document.body.appendChild(script);

    const url = window.location.href;

    if (url.includes('index.html')) {
      window.location.href = url.replace('index.html', '');
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <Component {...pageProps} />;
}
