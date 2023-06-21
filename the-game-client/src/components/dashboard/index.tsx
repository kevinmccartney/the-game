'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/components/layouts';
import { AuthGuard } from '@the-game/client/components';
import { getAuth } from 'firebase/auth';

const Dashboard = () => {
  const auth = getAuth();
  return (
    <AuthGuard>
      <DefaultLayout>
        <header className="App-header">
          <VStack>
            <Heading
              size="4xl"
              color="purple.500"
              className="font-bold"
              textAlign="center"
              as="h1"
            >
              Hello {auth.currentUser?.displayName}
            </Heading>
          </VStack>
        </header>
      </DefaultLayout>
    </AuthGuard>
  );
};

export default Dashboard;
