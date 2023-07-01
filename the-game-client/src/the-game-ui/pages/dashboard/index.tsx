'use client';

import React, { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { utcToZonedTime } from 'date-fns-tz';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

import { DefaultLayout } from '@the-game/client/the-game-ui/layouts';
import { AuthGuard } from '@the-game/client/the-game-ui/components';
import { Point } from '@the-game/client/the-game-ui/models';
import { PointCard } from '@the-game/client/the-game-ui/components/point-card/PointCard';

const Dashboard = () => {
  const [userPoints, setUserPoints] = useState<Point[]>([]);
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
    };

    fetchUserPoints();
  });
  return (
    <AuthGuard>
      <DefaultLayout>
        <Box
          as="section"
          mt={24}
        >
          <Flex flexDirection="column">
            <Heading
              size="2xl"
              // color="blue.500"
              className="font-bold"
              textAlign={{ lg: 'center' }}
              as="h1"
            >
              Hello {auth.currentUser?.displayName} 👋
            </Heading>
            <Flex
              flexDirection="column"
              gap={8}
              mt={10}
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
      </DefaultLayout>
    </AuthGuard>
  );
};

export default Dashboard;
