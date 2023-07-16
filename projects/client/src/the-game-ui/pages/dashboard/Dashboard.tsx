'use client';

import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  AddPointsDrawer,
  AssignPointsForm,
  AuthGuard,
  DashboardHeader,
  PointsFeed,
} from '@the-game/ui/components';
import { ModalContext } from '@the-game/ui/contexts';
import { DefaultContainer } from '@the-game/ui/layouts';
import { useGetNotificationsQuery } from '@the-game/ui/services/notifications';
import { useGetPointsQuery } from '@the-game/ui/services/points';
import { useGetScoresQuery } from '@the-game/ui/services/scores';

export const Dashboard = () => {
  const {
    isOpen: drawerIsOpen,
    onClose: drawerOnClose,
    onOpen: drawerOnOpen,
  } = useDisclosure();
  const {
    isOpen: modalIsOpen,
    onClose: modalOnClose,
    onOpen: modalOnOpen,
  } = useDisclosure();
  const router = useRouter();
  const [pointsFilter, setPointsFilter] = useState('all');
  const [onboardingModalHasBeenOpened, setOnboardingModalHasBeenOpened] =
    useState(false);
  const btnRef = useRef<any>();
  const auth = getAuth();
  const userUid = auth.currentUser?.uid || '';
  const { refetch: pointsRefetch } = useGetPointsQuery({
    type: pointsFilter,
    userId: userUid,
  });
  const modalPortalRef = useContext(
    ModalContext,
  ) as React.MutableRefObject<null>;

  const { refetch: scoresRefetch } = useGetScoresQuery(userUid);
  const { data: notificationsData } = useGetNotificationsQuery(
    auth.currentUser?.uid || '',
  );
  const hasOnboardingNotification = notificationsData
    ? notificationsData.map((x) => x.type).includes('user-onboarding')
    : false;

  if (hasOnboardingNotification && !onboardingModalHasBeenOpened) {
    modalOnOpen();
    setOnboardingModalHasBeenOpened(true);
  }

  const onSubmitSuccess = async () => {
    await scoresRefetch();
    await pointsRefetch();
    drawerOnClose();
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
          <DashboardHeader
            auth={auth}
            btnRef={btnRef}
            onOpen={drawerOnOpen}
          />
          <Card
            display={{ base: 'none', md: 'flex' }}
            justifyContent={{ md: 'center' }}
            my={12}
          >
            <CardBody>
              <AssignPointsForm onSubmitSuccess={onSubmitSuccess} />
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
      <AddPointsDrawer
        finalFocusRef={btnRef}
        isOpen={drawerIsOpen}
        onClose={drawerOnClose}
      >
        <AssignPointsForm onSubmitSuccess={onSubmitSuccess} />
      </AddPointsDrawer>
      <Portal containerRef={modalPortalRef}>
        Portal: This text is portaled!
        <Modal
          isCentered={true}
          isOpen={modalIsOpen}
          onClose={modalOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Welcome to The Game!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Do you want to complete your profile?</Text>
            </ModalBody>

            <ModalFooter gap={4}>
              <Button
                colorScheme="blue"
                onClick={modalOnClose}
                variant="outline"
              >
                Not now
              </Button>
              <Button
                onClick={() => {
                  router.push('/users/123/profile/edit').catch((e) => {
                    console.log(e);
                  });
                }}
                colorScheme="blue"
                mr={3}
              >
                Sure
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Portal>
    </AuthGuard>
  );
};
