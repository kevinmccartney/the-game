import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head></Head>
      <body>
        <Main />
        <NextScript />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://www.gstatic.com/firebasejs/8.0/firebase.js"></script>
      </body>
    </Html>
  );
}
