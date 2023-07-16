import { Box, Button, Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { Auth } from 'firebase/auth';
import React, { FunctionComponent } from 'react';

import { Score } from '@the-game/ui/components/score';

export const DashboardHeader: FunctionComponent<{
  auth: Auth;
  btnRef: React.MutableRefObject<any>;
  onOpen: () => void;
}> = ({ auth, btnRef, onOpen }) => (
  <Flex
    flexDirection={{ base: 'column', md: 'row' }}
    gap={{ md: 16 }}
    justifyContent={{ md: 'space-between' }}
  >
    <Box>
      <Heading
        as="h1"
        fontWeight={400}
        size="2xl"
      >
        Hello{' '}
        <Box
          display="block"
          fontWeight={700}
        >
          {auth.currentUser?.displayName} 👋
        </Box>
      </Heading>
      <Heading
        as="h2"
        size="lg"
      >
        <Text
          as="span"
          fontStyle="italic"
          fontWeight={400}
        >
          Are you ready to assign value to your friends?{' '}
        </Text>
        😈
      </Heading>
    </Box>
    <Divider
      borderBottomColor="gray.500"
      display={{ md: 'none' }}
      my={8}
    />
    <Flex
      alignItems="center"
      gap={16}
      justifyContent={{ base: 'space-between', sm: 'center' }}
      width={{ md: 24 }} // TODO: do this better, kinda hacky
    >
      <Box>
        <Score
          currentUserScore={true}
          uid={auth.currentUser?.uid || ''}
        />
      </Box>
      <Button
        colorScheme="blue"
        display={{ md: 'none' }}
        onClick={onOpen}
        ref={btnRef}
      >
        Assign Points
      </Button>
    </Flex>
  </Flex>
);
