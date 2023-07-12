'use client';

import {
  Alert,
  AlertIcon,
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
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  ChoiceChips,
  PointCard,
  Score,
  SkeletonPointCard,
} from '@the-game/ui/components';
import { DefaultLayout } from '@the-game/ui/layouts';
import {
  useGetPointsQuery,
  useGetUserEntityQuery,
} from '@the-game/ui/services';

export const UserProfile = () => {
  const [pointsFilter, setPointsFilter] = useState('all');
  const { query } = useRouter();
  const { id } = query;
  const auth = getAuth();

  const { data: userData, isLoading: userIsLoading } = useGetUserEntityQuery(
    (id as string) || '',
  );

  const { data: pointsData, isLoading: pointsIsLoading } = useGetPointsQuery({
    type: pointsFilter,
    userId: (id as string) || '',
  });

  const onPointsFilterChange = (value: string) => {
    setPointsFilter(value);
  };

  return (
    <DefaultLayout>
      <Helmet>
        <title>The Game</title>
      </Helmet>
      <header className="App-header">
        {userData && (
          <Flex flexDirection="column">
            <Card
              alignItems="center"
              flexDirection={{ base: 'column', md: 'row' }}
              my={16}
              w="100%"
            >
              <CardHeader>
                <SkeletonCircle
                  isLoaded={!userIsLoading}
                  size="32"
                >
                  <Avatar
                    name={userData.display_name}
                    referrerPolicy="no-referrer"
                    size="2xl"
                    src={userData.photo_url || ''}
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
                  <Heading>{userData.display_name}</Heading>
                </Skeleton>
                <Score
                  currentUserScore={id === auth.currentUser?.uid}
                  uid={id as string}
                />
              </CardBody>
            </Card>

            <Flex
              flexDirection="column"
              gap={8}
              mb={16}
            >
              <ChoiceChips onChange={onPointsFilterChange} />
              {pointsIsLoading &&
                [...Array(3).keys()].map(() => <SkeletonPointCard />)}
              {pointsData?.map((x) => (
                <PointCard
                  key={x.id}
                  point={x}
                />
              ))}
              {pointsData?.length === 0 && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                >
                  <Alert status="info">
                    <AlertIcon />
                    No points found
                  </Alert>
                </Flex>
              )}
            </Flex>
          </Flex>
        )}
      </header>
    </DefaultLayout>
  );
};
