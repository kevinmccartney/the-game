'use client';

import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
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
  Loading,
  PointCard,
} from '@the-game/client/the-game-ui/components';
import { DefaultLayout } from '@the-game/client/the-game-ui/layouts';
import {
  AssignPointsForm as AssignPointsFormModel,
  Point,
} from '@the-game/client/the-game-ui/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useGetPointsQuery } from '@the-game/client/the-game-ui/services/points';
import { useGetScoresQuery } from '@the-game/client/the-game-ui/services/scores';

const Dashboard = () => {
  const [userScore, setUserScore] = useState('');
  const [userScoreIsLoading, setUserScoreIsLoading] = useState(false);
  const [userScoreColor, setUserScoreColor] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const form = useForm<AssignPointsFormModel>();

  const auth = getAuth();
  const {
    data: pointsData,
    isLoading: pointsIsLoading,
    refetch: pointsRefetch,
  } = useGetPointsQuery(auth.currentUser?.uid || '');

  const {
    data: scoresData,
    isLoading: scoresIsLoading,
    refetch: scoresRefetch,
  } = useGetScoresQuery(auth.currentUser?.uid || '');

  const onSubmitSuccess = () => {
    scoresRefetch();
    pointsRefetch();
  };

  const getScoreColor = (score: { points: number } | undefined) => {
    let color;
    if (score) {
      color = score.points > 0 ? 'green.500' : 'red.500';
    }

    return color;
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = await auth.currentUser?.getIdToken();

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
      setUserScoreIsLoading(false);
    };

    fetchUserPoints();
  }, []);
  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Dashboard</title>
      </Helmet>
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
                  {scoresIsLoading ? (
                    <Loading />
                  ) : (
                    <Text
                      fontWeight={700}
                      fontSize="4xl"
                      // color={userScoreColor}
                      color={getScoreColor(scoresData)}
                      textAlign="center"
                    >
                      {scoresData?.points}
                    </Text>
                  )}
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

            <Card
              display={{ base: 'none', md: 'flex' }}
              justifyContent={{ md: 'center' }}
              my={12}
            >
              <CardBody>
                <AssignPointsForm
                  form={form}
                  inverse={true}
                  onSubmitSuccess={onSubmitSuccess}
                />
              </CardBody>
            </Card>
            <Divider
              my={8}
              borderBottomColor="gray.500"
              display={{ md: 'none' }}
            />
            <Flex
              flexDirection="column"
              gap={8}
            >
              {pointsIsLoading && (
                <Flex
                  p={8}
                  justifyContent="center"
                >
                  <Loading />
                </Flex>
              )}
              {pointsData?.map((x) => (
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
              <AssignPointsForm
                onClose={onClose}
                form={form}
                showCancel={true}
                onSubmitSuccess={onSubmitSuccess}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </DefaultLayout>
    </AuthGuard>
  );
};

export default Dashboard;
