'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/components/layouts';

const Unauthorized = () => (
  <DefaultLayout>
    <header className="App-header">
      <VStack>
        <Heading
          size="4xl"
          color="purple.500"
          className="font-bold"
          as="h1"
        >
          Unauthorized
        </Heading>
      </VStack>
    </header>
  </DefaultLayout>
);

export default Unauthorized;
