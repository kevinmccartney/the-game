/* eslint-disable react/react-in-jsx-scope */

'use client';

import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { Loading } from '@the-game/ui/components';
import store from '@the-game/ui/state/store';
import theme from '@the-game/ui/theme';

// eslint-disable-next-line import/no-unassigned-import
import './globals.css';

// eslint-disable-next-line functional/immutable-data
fontAwesomeConfig.autoAddCss = false;

const MyApp = ({
  Component,
  pageProps,
}: Readonly<{
  Component: any;
  pageProps: any;
}>) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      //  TODO: revisit this, might be a bit hacky
      if (!isInitialized) {
        const url = window.location.href;

        if (url.includes('index.html')) {
          // eslint-disable-next-line functional/immutable-data
          window.location.href = url.replace('index.html', '');
        }

        const config = {
          apiKey: 'AIzaSyDurKKzRP9h_692StW7-SvcTpVZN0oCRE4',
          authDomain: 'the-game-388502.firebaseapp.com',
        };

        initializeApp(config);
        const auth = getAuth();

        await setPersistence(auth, browserLocalPersistence);

        setIsInitialized(true);
      }
    };

    initialize().catch((e) => {
      console.log(e);
    });
  });

  return (
    <Provider store={store}>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <Box color="gray.700">
            {isInitialized ? (
              <Component {...pageProps} />
            ) : (
              <Flex
                alignItems="center"
                h="100vh"
                justifyContent="center"
                w="100vw"
              >
                <Loading />
              </Flex>
            )}
          </Box>
        </ChakraProvider>
      </HelmetProvider>
    </Provider>
  );
};

export default MyApp;
/* eslint-enable react/react-in-jsx-scope */
