import './globals.css';

// https://issuetracker.google.com/issues/151713401#comment3
// https://react.dev/learn/synchronizing-with-effects#not-an-effect-initializing-the-application
const url = window.location.href;
if (url.includes('index.html')) {
  window.location.href = url.replace('index.html', '');
}

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return <Component {...pageProps} />;
}
