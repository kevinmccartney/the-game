import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from '@chakra-ui/react';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';

import { MaybeLinked } from '@the-game/ui/components/maybe-linked';
import { Point } from '@the-game/ui/models';
import { useGetUserEntityQuery } from '@the-game/ui/services';

export const PointCard = ({ point }: Readonly<{ point: Readonly<Point> }>) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcZonedTime = utcToZonedTime(point.created_time, timezone);
  const formattedDistance = formatDistanceToNow(utcZonedTime);
  const auth = getAuth();
  const { data: currentUserData } = useGetUserEntityQuery(
    auth.currentUser?.uid || '',
  );

  const pointsColor = point.points > 0 ? 'green.500' : 'red.500';

  return (
    <Card
      boxShadow="lg"
      flexDirection="row"
      key={point.id}
    >
      <CardHeader>
        <Link
          href={`/users/${
            currentUserData?.uid === point.created_by.uid
              ? point.subject.uid
              : point.created_by.uid
          }/profile`}
        >
          <Avatar
            name={
              currentUserData?.uid === point.created_by.uid
                ? point.subject.display_name
                : point.created_by.display_name
            }
            src={
              currentUserData?.uid === point.created_by.uid
                ? point.subject.photo_url || ''
                : point.created_by.photo_url || ''
            }
            referrerPolicy="no-referrer"
          />
        </Link>
      </CardHeader>
      <CardBody>
        <Box flexDirection="column">
          <Heading
            as="h3"
            fontSize="l"
            fontWeight={400}
          >
            <Text
              fontWeight={
                point.created_by.uid !== currentUserData?.uid ? 700 : 400
              }
              as="span"
            >
              <MaybeLinked
                href={`/users/${point.created_by.uid}/profile`}
                isLinked={point.created_by.uid !== currentUserData?.uid}
              >
                {currentUserData?.uid === point.created_by.uid
                  ? 'You'
                  : point.created_by.display_name}
              </MaybeLinked>
            </Text>{' '}
            gave{' '}
            <MaybeLinked
              href={`/users/${point.subject.uid}/profile`}
              isLinked={point.subject.uid !== currentUserData?.uid}
            >
              <Text
                fontWeight={
                  point.subject.uid !== currentUserData?.uid ? 700 : 400
                }
                as="span"
              >
                {currentUserData?.uid === point.subject.uid
                  ? 'You'
                  : point.subject.display_name}
              </Text>
            </MaybeLinked>
            <Box
              as="span"
              color={pointsColor}
              fontWeight={700}
            >
              {' '}
              {point.points} points
            </Box>
          </Heading>
          <Heading
            as="h4"
            fontSize="l"
            fontStyle="italic"
            fontWeight={400}
            mt={1}
          >
            <FontAwesomeIcon icon={faClock} /> {formattedDistance} Ago
          </Heading>
          <Text
            fontSize="xl"
            fontStyle="italic"
            ml={4}
            mt={4}
          >
            &ldquo;{point.reason}&ldquo;
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};
