'use client';

import { Heading, VStack } from '@chakra-ui/react';
import React from 'react';

import { DefaultLayout } from '@the-game/ui/layouts';

const Login = () => (
  <DefaultLayout>
    <header className="App-header">
      <VStack>
        <Heading
          as="h1"
          className="font-bold"
          color="purple.500"
          size="4xl"
        >
          Login
        </Heading>
      </VStack>
    </header>
  </DefaultLayout>
);

export default Login;
