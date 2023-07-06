'use client';

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
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth } from 'firebase/auth';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import {
  AssignPointsForm,
  AuthGuard,
  Loading,
  PointCard,
} from '@the-game/ui/components';
import { DefaultLayout } from '@the-game/ui/layouts';
import { AssignPointsForm as AssignPointsFormModel } from '@the-game/ui/models';
import { useGetPointsQuery } from '@the-game/ui/services/points';
import { useGetScoresQuery } from '@the-game/ui/services/scores';

export const Dashboard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnRef = useRef<any>();
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

  const onSubmitSuccess = async () => {
    await scoresRefetch();
    await pointsRefetch();
  };

  const getScoreColor = (
    score: Readonly<{ points: number }> | undefined,
  ): string | undefined =>
    score ? (score?.points > 0 ? 'green.500' : 'red.500') : undefined;

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
                  <Text
                    fontSize="xl"
                    fontWeight={400}
                    textAlign="center"
                  >
                    You Have
                  </Text>
                  {scoresIsLoading ? (
                    <Loading />
                  ) : (
                    <Text
                      // color={userScoreColor}
                      color={getScoreColor(scoresData)}
                      fontSize="4xl"
                      fontWeight={700}
                      textAlign="center"
                    >
                      {scoresData?.points}
                    </Text>
                  )}
                  <Text
                    fontSize="xl"
                    fontWeight={400}
                    textAlign="center"
                  >
                    points
                  </Text>
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

            <Card
              display={{ base: 'none', md: 'flex' }}
              justifyContent={{ md: 'center' }}
              my={12}
            >
              <CardBody>
                <AssignPointsForm
                  form={form}
                  inverse={true}
                  onSubmitSuccess={void onSubmitSuccess}
                />
              </CardBody>
            </Card>
            <Divider
              borderBottomColor="gray.500"
              display={{ md: 'none' }}
              my={8}
            />
            <Flex
              flexDirection="column"
              gap={8}
            >
              {pointsIsLoading && (
                <Flex
                  justifyContent="center"
                  p={8}
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
          finalFocusRef={btnRef}
          isOpen={isOpen}
          onClose={onClose}
          placement="right"
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color="white">
              <FontAwesomeIcon
                icon={faXmark}
                inverse={true}
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
                form={form}
                onClose={onClose}
                onSubmitSuccess={void onSubmitSuccess}
                showCancel={true}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </DefaultLayout>
    </AuthGuard>
  );
};
