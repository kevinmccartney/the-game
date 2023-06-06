import React from 'react';

import {
  Center,
  ChakraProvider,
  Heading,
  VStack,
  Flex,
} from '@chakra-ui/react';

import { Navbar, Footer } from '../../components';
import theme from '../../theme';

export const Landing = () => (
  <ChakraProvider theme={theme}>
    <Flex
      flexDirection="column"
      minHeight="100vh"
      justifyContent="space-between"
    >
      <Navbar />
      <Center role="main">
        <header className="App-header">
          <VStack>
            <Heading
              size="4xl"
              color="purple.500"
              className="font-bold"
              as="h1"
            >
              The Game
            </Heading>
            <Heading
              size="2xl"
              color="purple.500"
              className="font-light"
            >
              It's all about points baby
            </Heading>
          </VStack>
        </header>
      </Center>
      <Footer />
    </Flex>
  </ChakraProvider>
);
