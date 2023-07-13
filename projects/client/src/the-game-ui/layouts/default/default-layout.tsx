import { Box, Grid, useBreakpointValue } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import React, { FunctionComponent, PropsWithChildren } from 'react';

import { BottomNav, Header, SideNav } from '@the-game/ui/components';

export const DefaultLayout: FunctionComponent<
  PropsWithChildren<{
    isInitialized: boolean;
  }>
> = ({ children, isInitialized }) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  const isLoggedIn = () => {
    const auth = getAuth();

    return !!auth.currentUser;
  };

  return (
    <Grid
      gridTemplateAreas={{
        base: `
              'header header'
              'main main'
              'bottomNav bottomNav'
            `,
        lg:
          isInitialized && isLoggedIn()
            ? `
              'header header'
              'aside main'
              'bottomNav bottomNav'
            `
            : `
              'header header'
              'main main'
              'bottomNav bottomNav'
            `,
      }}
      backgroundColor="gray.50"
      gridTemplateColumns="1fr 4fr"
      gridTemplateRows="64px 1fr"
      maxHeight={{ base: undefined, lg: '100vh' }}
      minHeight={{ base: '100vh', lg: undefined }}
    >
      <Header gridArea="header" />
      {isInitialized && isLoggedIn() && !isMobile && (
        <SideNav
          display={{ base: 'none', lg: 'initial' }}
          gridArea="aside"
        />
      )}
      <Box
        boxShadow={
          isInitialized
            ? {
                base: 'inset 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                lg: 'inset 0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }
            : undefined
        }
        gridArea="main"
        maxHeight={{ lg: '100vh' }}
        overflow="auto"
        px={6}
        role="main"
      >
        {children}
      </Box>
      {isInitialized && isLoggedIn() && isMobile && (
        <BottomNav gridArea="bottomNav" />
      )}
    </Grid>
  );
};
