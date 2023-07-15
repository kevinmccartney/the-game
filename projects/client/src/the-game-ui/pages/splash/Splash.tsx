'use client';

import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Footer } from '@the-game/ui/components';
import { DefaultContainer } from '@the-game/ui/layouts';

export const Splash = () => {
  const router = useRouter();
  const handleGetStartedClick = () => {
    void router.push('/login');
  };

  return (
    <>
      <Helmet>
        <title>The Game</title>
      </Helmet>
      <DefaultContainer containerProps={{ height: '100%' }}>
        <Flex
          alignItems="center"
          flexDirection="column"
          h="100%"
          justifyContent="space-between"
        >
          <Flex
            as="header"
            className="App-header"
            flexDirection="column"
            flexGrow={1}
            justifyContent="center"
          >
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
              <Button
                colorScheme="blue"
                mt={6}
                onClick={handleGetStartedClick}
              >
                Log in
              </Button>
            </VStack>
          </Flex>
          <Box
            bottom={0}
            left={0}
            position="absolute"
            width="100%"
          >
            <Footer inverse={true} />
          </Box>
        </Flex>
      </DefaultContainer>
    </>
  );
};
