import { Box, Flex, Grid } from '@chakra-ui/react';
// eslint-disable-next-line import/no-unassigned-import
import '@fortawesome/fontawesome-svg-core/styles.css';
import React, { FunctionComponent } from 'react';

import { Footer, Navbar } from '@the-game/ui/components';
import { ReactChildren } from '@the-game/ui/models';

export const DefaultLayout: FunctionComponent<{
  children: ReactChildren;
  flexProps?: { [key: string]: string };
}> = ({ children, flexProps }) => (
  <Grid
    gridTemplateRows="72px 1fr 56px"
    minH="100vh"
  >
    <Navbar />
    <Flex
      alignItems="center"
      backgroundColor="gray.50"
      flexDirection="column"
      flexGrow={1}
      {...flexProps}
      px={6}
      role="main"
    >
      <Box
        maxW={{
          lg: 'container.lg',
          md: 'container.md',
          sm: 'container.sm',
        }}
        width="100%"
      >
        {children}
      </Box>
    </Flex>
    <Footer />
  </Grid>
);

DefaultLayout.defaultProps = {
  flexProps: {},
};
