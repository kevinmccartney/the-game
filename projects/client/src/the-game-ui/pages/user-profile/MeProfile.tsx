import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import { Score } from '@the-game/ui/components';
import { useGetMeQuery } from '@the-game/ui/services';

export const MeProfile = () => {
  const auth = getAuth();
  const router = useRouter();
  const { data: userData, isLoading: userIsLoading } = useGetMeQuery();

  const handleEditProfileClick = () => {
    router.push('/profile/me/edit').catch((e) => {
      console.log(e);
    });
  };

  return (
    <>
      <Card mb={16}>
        <CardBody w="100%">
          <Flex
            alignItems={{ base: 'center', md: 'flex-start' }}
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            gap={8}
          >
            <Flex
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
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
              <Button
                colorScheme="blue"
                mt={6}
                onClick={handleEditProfileClick}
                variant="ghost"
              >
                Edit profile
              </Button>
            </Flex>

            <Flex
              alignItems="center"
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              flexGrow={1}
              justifyContent="space-between"
            >
              <Box>
                <Skeleton isLoaded={!userIsLoading}>
                  <Heading>{userData?.display_name}</Heading>
                </Skeleton>
                <Skeleton isLoaded={!userIsLoading}>
                  <Text>
                    <FontAwesomeIcon icon={faUser} /> @{userData?.username}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!userIsLoading}>
                  <Text>
                    <FontAwesomeIcon icon={faEarthAmericas} />{' '}
                    {userData?.location ? userData?.location : 'unknown'}
                  </Text>
                </Skeleton>
              </Box>
              <Score
                boxProps={{ mt: { base: 4, md: 0 } }}
                currentUserScore={true}
                uid={auth.currentUser?.uid || ''}
              />
            </Flex>
          </Flex>
          <Divider my={8} />
          <Box>
            <Heading fontSize="2xl">About me</Heading>
            <SkeletonText
              isLoaded={!userIsLoading}
              skeletonHeight="3"
              spacing="4"
            >
              <Text mt={2}>
                {userData?.about_me ? userData?.about_me : 'No about me info.'}
              </Text>
            </SkeletonText>
          </Box>
          <Divider my={8} />
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            gap={8}
          >
            <Box flexGrow={1}>
              <Heading fontSize="2xl">Likes</Heading>
              <SkeletonText
                isLoaded={!userIsLoading}
                skeletonHeight="3"
                spacing="4"
              >
                <Text mt={2}>
                  <Text mt={2}>
                    {userData?.likes && userData?.likes.length > 0
                      ? userData?.likes.map((x) => `${x} `)
                      : 'No likes.'}
                  </Text>
                </Text>
              </SkeletonText>
            </Box>
            <Box flexGrow={1}>
              <Heading fontSize="2xl">Dislikes</Heading>
              <SkeletonText
                isLoaded={!userIsLoading}
                skeletonHeight="3"
                spacing="4"
              >
                <Text mt={2}>
                  {userData?.dislikes && userData?.dislikes.length > 0
                    ? userData?.dislikes.map((x) => `${x} `)
                    : 'No dislikes.'}
                </Text>
              </SkeletonText>
            </Box>
          </Flex>
          <Divider my={8} />
          <Heading fontSize="2xl">Friends</Heading>
          <Skeleton
            height={14}
            isLoaded={!userIsLoading}
          >
            <Text mt={2}>
              {userData?.friends && userData?.friends.length > 0
                ? userData?.friends.map((x) => `${x} `)
                : 'No friends.'}
            </Text>
          </Skeleton>
        </CardBody>
      </Card>
      {/* <PointsFeed uid={auth.currentUser?.uid || ''} /> */}
    </>
  );
};
