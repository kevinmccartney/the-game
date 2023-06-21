'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/components/layouts';
import { AuthGuard } from '@the-game/client/components';

const Dashboard = () => (
  <AuthGuard>
    <DefaultLayout>
      <header className="App-header">
        <VStack>
          <Heading
            size="4xl"
            color="purple.500"
            className="font-bold"
            as="h1"
          >
            Dashboard
          </Heading>
        </VStack>
      </header>
    </DefaultLayout>
  </AuthGuard>
);

export default Dashboard;
