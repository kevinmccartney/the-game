import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const Document = () => (
  <Html>
    <Head>
      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link
        href="/site.webmanifest"
        rel="manifest"
      />
      <link
        href="https://fonts.googleapis.com"
        rel="preconnect"
      />
      <link
        crossOrigin=""
        href="https://fonts.gstatic.com"
        rel="preconnect"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Roboto:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <meta
        content="#805ad5"
        name="theme-color"
      />
      <meta
        content="yes"
        name="apple-mobile-web-app-capable"
      />
      <meta
        content="black-translucent"
        name="apple-mobile-web-app-status-bar-style"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
