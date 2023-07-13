'use client';

import { Flex, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { AuthGuard } from '@the-game/ui/components';

export const Friends = () => (
  <AuthGuard>
    <Helmet>
      <title>The Game | Friends</title>
    </Helmet>
    <Flex
      alignItems="center"
      flexDirection="column"
      h="100%"
      justifyContent="center"
    >
      <header className="App-header">
        <VStack>
          <Heading
            as="h1"
            className="font-bold"
            lineHeight={1.5}
            size="4xl"
            textAlign="center"
          >
            Coming Soon ✨
          </Heading>
        </VStack>
      </header>
    </Flex>
  </AuthGuard>
);
