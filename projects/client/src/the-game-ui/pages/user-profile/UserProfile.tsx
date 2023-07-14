'use client';

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { AuthGuard, PointsFeed, Score } from '@the-game/ui/components';
import { useGetUserEntityQuery } from '@the-game/ui/services';

export const UserProfile = () => {
  const { query } = useRouter();
  const auth = getAuth();

  const { id } = query;

  const { data: userData, isLoading: userIsLoading } = useGetUserEntityQuery(
    (id as string) || '',
  );

  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Profile</title>
      </Helmet>
      <Flex
        flexDirection="column"
        py={8}
      >
        <Card
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
          mb={16}
          w="100%"
        >
          <CardHeader>
            <SkeletonCircle
              isLoaded={!userIsLoading}
              size="32"
            >
              <Avatar
                name={userData?.display_name}
                referrerPolicy="no-referrer"
                size="2xl"
                src={userData?.photo_url || ''}
              />
            </SkeletonCircle>
          </CardHeader>
          <CardBody
            alignItems="center"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <Skeleton isLoaded={!userIsLoading}>
              <Heading>{userData?.display_name}</Heading>
            </Skeleton>
            <Score
              currentUserScore={id === auth.currentUser?.uid}
              uid={id as string}
            />
          </CardBody>
        </Card>
        <PointsFeed uid={auth.currentUser?.uid || ''} />
      </Flex>
    </AuthGuard>
  );
};
