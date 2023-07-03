'use client';

import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';

import {
  AssignPointsForm,
  AuthGuard,
  PointCard,
} from '@the-game/client/the-game-ui/components';
import { DefaultLayout } from '@the-game/client/the-game-ui/layouts';
import { Point } from '@the-game/client/the-game-ui/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [userScore, setUserScore] = useState('-');
  const [userScoreColor, setUserScoreColor] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();

  const auth = getAuth();

  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = await auth.currentUser?.getIdToken();
      const userPointsRes = await fetch(
        `https://api.the-game.kevinmccartney.dev/v1/users/${auth.currentUser?.uid}/points`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userPoints = await userPointsRes.json();

      setUserPoints(userPoints);

      const userScoreRes = await fetch(
        `https://api.the-game.kevinmccartney.dev/v1/users/${auth.currentUser?.uid}/scores`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userScore = await userScoreRes.json();

      const colorForUserScore = userScore.points > 0 ? 'green.500' : 'red.500';
      setUserScoreColor(colorForUserScore);
      setUserScore(userScore.points);
    };

    fetchUserPoints();
  }, []);
  return (
    <AuthGuard>
      <DefaultLayout>
        <Box
          as="section"
          my={16}
        >
          <Flex flexDirection="column">
            <Flex
              flexDirection={{ base: 'column', md: 'row' }}
              gap={{ md: 16 }}
              justifyContent={{ md: 'space-between' }}
            >
              <Box>
                <Heading
                  size="2xl"
                  as="h1"
                  fontWeight={400}
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
                  size="lg"
                  as="h2"
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
                my={8}
                borderBottomColor="gray.500"
                display={{ md: 'none' }}
              />
              <Flex
                alignItems="center"
                width={{ md: 24 }} // TODO: do this better, kinda hacky
                justifyContent={{ base: 'space-between', sm: 'center' }}
                gap={16}
              >
                <Box>
                  <Text
                    fontWeight={400}
                    fontSize="xl"
                    textAlign="center"
                  >
                    You Have
                  </Text>
                  <Text
                    fontWeight={700}
                    fontSize="4xl"
                    color={userScoreColor}
                    textAlign="center"
                  >
                    {userScore}
                  </Text>
                  <Text
                    fontWeight={400}
                    fontSize="xl"
                    textAlign="center"
                  >
                    points
                  </Text>
                </Box>
                <Button
                  colorScheme="blue"
                  display={{ md: 'none' }}
                  ref={btnRef}
                  onClick={onOpen}
                >
                  Assign Points
                </Button>
              </Flex>
            </Flex>
            <Divider
              my={8}
              borderBottomColor="gray.500"
              display={{ base: 'none', md: 'flex' }}
            />
            <Box display={{ base: 'none', md: 'flex' }}>
              <AssignPointsForm />
            </Box>
            <Divider
              my={8}
              borderBottomColor="gray.500"
            />
            <Flex
              flexDirection="column"
              gap={8}
            >
              {userPoints.map((x) => (
                <PointCard
                  key={x.id}
                  point={x}
                />
              ))}
            </Flex>
          </Flex>
        </Box>
        <Drawer
          isOpen={isOpen}
          placement="right"
          size="full"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color="white">
              <FontAwesomeIcon
                icon={faXmark}
                inverse
                size="2x"
              />
            </DrawerCloseButton>
            <DrawerHeader
              backgroundColor="purple.500"
              color="white"
            >
              Assign Points
            </DrawerHeader>

            <DrawerBody>
              <AssignPointsForm onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </DefaultLayout>
    </AuthGuard>
  );
};

export default Dashboard;
