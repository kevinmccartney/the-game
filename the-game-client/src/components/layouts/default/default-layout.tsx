import { Center, ChakraProvider, Flex } from '@chakra-ui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import theme from '@the-game/client/app/theme';
import { Footer, Navbar } from '@the-game/client/components';
import { FunctionComponent } from 'react';

config.autoAddCss = false;

export const DefaultLayout: FunctionComponent<{ children: any }> = (props) => {
  return (
    <ChakraProvider theme={theme}>
      <Flex
        flexDirection="column"
        minHeight="100vh"
        justifyContent="space-between"
      >
        <Navbar />
        <Center role="main">{props.children}</Center>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
};
