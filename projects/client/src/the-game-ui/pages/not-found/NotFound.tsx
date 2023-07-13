'use client';

import { Button, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const NotFound = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/').catch(() => {});
  };
  return (
    <>
      <Helmet>
        <title>The Game</title>
      </Helmet>
      <header className="App-header">
        <VStack>
          <Heading
            as="h1"
            className="font-bold"
            color="purple.500"
            size="3xl"
            textAlign="center"
          >
            Not Found
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
    </>
  );
};
