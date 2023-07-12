'use client';

import { Flex, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { DefaultLayout } from '@the-game/ui/layouts';

export const Splash = () => (
  <DefaultLayout
    flexProps={{
      justifyContent: 'center',
    }}
  >
    <Helmet>
      <title>The Game</title>
    </Helmet>
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <header className="App-header">
        <VStack>
          <Heading
            as="h1"
            className="font-bold"
            color="purple.500"
            size="4xl"
            textAlign="center"
          >
            The Game
          </Heading>
          <Heading
            className="font-light"
            color="purple.500"
            size="2xl"
            textAlign="center"
          >
            It&apos;s all about points baby
          </Heading>
        </VStack>
      </header>
    </Flex>
  </DefaultLayout>
);
