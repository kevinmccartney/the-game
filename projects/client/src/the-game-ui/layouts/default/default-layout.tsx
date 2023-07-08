import { Box, Flex } from '@chakra-ui/react';
// eslint-disable-next-line import/no-unassigned-import
import '@fortawesome/fontawesome-svg-core/styles.css';
import React, { FunctionComponent } from 'react';

import { Footer, Navbar } from '@the-game/ui/components';

export const DefaultLayout: FunctionComponent<{ children: any }> = (props) => (
  <Flex
    flexDirection="column"
    minHeight="100vh"
  >
    <Navbar />
    <Flex
      alignItems="center"
      backgroundColor="gray.50"
      flexDirection="column"
      flexGrow={1}
      justifyContent="center"
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
        {props?.children}
      </Box>
    </Flex>
    <Footer />
  </Flex>
);
