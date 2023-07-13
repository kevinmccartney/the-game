'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { AuthGuard, Footer } from '@the-game/ui/components';
import { DefaultContainer } from '@the-game/ui/layouts';
import { logoutClickHandler } from '@the-game/ui/utils';

export const Settings = () => {
  const auth = getAuth();
  const router = useRouter();

  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Settings</title>
      </Helmet>
      <DefaultContainer containerProps={{ height: '100%' }}>
        <Card
          h="100%"
          w="100%"
        >
          <CardBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Heading as="h1">Settings</Heading>
              <Divider mt={2} />
              <Heading
                as="h2"
                mt={6}
                size="lg"
              >
                Account
              </Heading>
              <Divider mt={2} />
              <Button
                colorScheme="red"
                mt={8}
                onClick={logoutClickHandler({ auth, router })}
              >
                Logout
              </Button>
            </Box>
            <Footer />
          </CardBody>
        </Card>
      </DefaultContainer>
    </AuthGuard>
  );
};
