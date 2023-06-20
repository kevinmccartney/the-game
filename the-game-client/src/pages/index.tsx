'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/components/layouts';

const Landing = () => (
  <DefaultLayout>
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
          It{"'"}s all about points baby
        </Heading>
      </VStack>
    </header>
  </DefaultLayout>
);

export default Landing;
