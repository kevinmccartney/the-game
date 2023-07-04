'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/the-game-ui/layouts';
import { Helmet } from 'react-helmet-async';

const Splash = () => (
  <DefaultLayout>
    <Helmet>
      <title>The Game</title>
    </Helmet>
    <header className="App-header">
      <VStack>
        <Heading
          size="4xl"
          color="purple.500"
          className="font-bold"
          as="h1"
          textAlign="center"
        >
          The Game
        </Heading>
        <Heading
          size="2xl"
          color="purple.500"
          className="font-light"
          textAlign="center"
        >
          It{"'"}s all about points baby
        </Heading>
      </VStack>
    </header>
  </DefaultLayout>
);

export default Splash;
