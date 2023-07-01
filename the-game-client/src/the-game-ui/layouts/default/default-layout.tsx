import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import theme from '@the-game/client/the-game-ui/theme';
import { Footer, Navbar } from '@the-game/client/the-game-ui/components';
import { FunctionComponent } from 'react';

config.autoAddCss = false;

export const DefaultLayout: FunctionComponent<{ children: any }> = (props) => {
  return (
    <ChakraProvider theme={theme}>
      <Flex
        flexDirection="column"
        minHeight="100vh"
      >
        <Navbar />
        <Flex
          role="main"
          px={6}
          flexGrow={1}
          justifyContent="center"
          backgroundColor="gray.50"
        >
          <Box
            maxW={{
              sm: 'container.sm',
              md: 'container.md',
              lg: 'container.lg',
            }}
            width="100%"
          >
            {props.children}
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
};
