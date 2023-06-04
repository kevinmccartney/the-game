import React from 'react';

import { Center, ChakraProvider, Heading, VStack } from '@chakra-ui/react';

import { Navbar } from './components/navbar';

const App = () => (
  <ChakraProvider>
    <Navbar />
    <Center
      minH="100vh"
      bgColor="blue.500"
    >
      <header className="App-header">
        <VStack>
          <Heading
            size="4xl"
            color="white"
          >
            The Game
          </Heading>
          <Heading
            size="2xl"
            color="white"
          >
            It's all about points baby
          </Heading>
        </VStack>
      </header>
    </Center>
  </ChakraProvider>
);

export default App;
