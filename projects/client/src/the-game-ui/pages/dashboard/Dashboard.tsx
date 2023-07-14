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
import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import {
  AssignPointsForm,
  AuthGuard,
  PointsFeed,
  Score,
} from '@the-game/ui/components';
import { DefaultContainer } from '@the-game/ui/layouts';
import { AssignPointsForm as AssignPointsFormModel } from '@the-game/ui/models';
import { useGetPointsQuery } from '@the-game/ui/services/points';
import { useGetScoresQuery } from '@the-game/ui/services/scores';

export const Dashboard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [pointsFilter, setPointsFilter] = useState('all');
  const btnRef = useRef<any>();
  const form = useForm<AssignPointsFormModel>();
  const auth = getAuth();
  const userUid = auth.currentUser?.uid || '';
  const { refetch: pointsRefetch } = useGetPointsQuery({
    type: pointsFilter,
    userId: userUid,
  });

  const { refetch: scoresRefetch } = useGetScoresQuery(userUid);

  const onSubmitSuccess = async () => {
    await scoresRefetch();
    await pointsRefetch();
  };

  const onPointsFeedTypeChange = (type: string) => {
    setPointsFilter(type);
  };

  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Dashboard</title>
      </Helmet>
      <DefaultContainer>
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
            borderBottomColor="gray.500"
            display={{ md: 'none' }}
            my={8}
          />
          <PointsFeed
            onTypeChange={onPointsFeedTypeChange}
            uid={auth.currentUser?.uid || ''}
          />
        </Flex>
      </DefaultContainer>
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
              onSubmitSuccess={onSubmitSuccess}
              showCancel={true}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </AuthGuard>
  );
};
