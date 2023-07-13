'use client';

import { Button, Flex, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Unauthorized = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/').catch(() => {});
  };

  return (
    <>
      <Helmet>
        <title>The Game | Unauthorized</title>
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
              color="purple.500"
              size="4xl"
              textAlign="center"
            >
              Unauthorized
            </Heading>
            <Button
              colorScheme="blue"
              mt={8}
              onClick={handleClick}
            >
              Go home
            </Button>
          </VStack>
        </header>
      </Flex>
    </>
  );
};
