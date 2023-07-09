'use client';

import { Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { DefaultLayout } from '@the-game/ui/layouts';

export const UserProfile = () => (
  <DefaultLayout>
    <Helmet>
      <title>The Game</title>
    </Helmet>
    <header className="App-header">
      <VStack>
        <Heading
          as="h1"
          className="font-bold"
          color="purple.500"
          size="4xl"
          textAlign="center"
        >
          User Profile
        </Heading>
      </VStack>
    </header>
  </DefaultLayout>
);
