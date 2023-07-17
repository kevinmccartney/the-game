'use client';

import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
// eslint-disable-next-line import/no-unassigned-import
import '@fortawesome/fontawesome-svg-core/styles.css';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { ActiveNavigationProvider, Loading } from '@the-game/ui/components';
import { ModalContext } from '@the-game/ui/contexts';
import { DefaultLayout } from '@the-game/ui/layouts';
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
  const ref = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      const config = {
        apiKey: 'AIzaSyDurKKzRP9h_692StW7-SvcTpVZN0oCRE4',
        authDomain: 'the-game-388502.firebaseapp.com',
      };

      initializeApp(config);
      const auth = getAuth();

      await setPersistence(auth, browserLocalPersistence);

      setIsInitialized(true);
    };

    initialize().catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <ActiveNavigationProvider>
            <ModalContext.Provider value={ref}>
              <Box color="gray.700">
                <DefaultLayout isInitialized={isInitialized}>
                  {isInitialized ? (
                    <Component {...pageProps} />
                  ) : (
                    <Flex
                      alignItems="center"
                      h="100%"
                      justifyContent="center"
                      w="100%"
                    >
                      <Loading />
                    </Flex>
                  )}
                </DefaultLayout>
                <Box ref={ref} />
              </Box>
            </ModalContext.Provider>
          </ActiveNavigationProvider>
        </ChakraProvider>
      </HelmetProvider>
    </Provider>
  );
};

export default MyApp;
