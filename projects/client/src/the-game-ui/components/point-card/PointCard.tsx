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

export const PointCard = ({ point }: Readonly<{ point: Readonly<Point> }>) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcZonedTime = utcToZonedTime(point.created_time, timezone);
  const formattedDistance = formatDistanceToNow(utcZonedTime);
  const auth = getAuth();

  const pointsColor = point.points > 0 ? 'green.500' : 'red.500';
  const currentUserUid = auth.currentUser?.uid;

  const isCreatedByCurrentUser = currentUserUid === point.created_by.uid;

  return (
    <Card
      boxShadow="lg"
      flexDirection="row"
      key={point.id}
    >
      <CardHeader>
        <Link
          href={`/users/${
            isCreatedByCurrentUser ? point.subject.uid : point.created_by.uid
          }/profile`}
        >
          <Avatar
            name={
              isCreatedByCurrentUser
                ? point.subject.display_name
                : point.created_by.display_name
            }
            src={
              isCreatedByCurrentUser
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
              as="span"
              fontWeight={point.created_by.uid !== currentUserUid ? 700 : 400}
            >
              <MaybeLinked
                href={`/users/${point.created_by.uid}/profile`}
                isLinked={point.created_by.uid !== currentUserUid}
              >
                {currentUserUid === point.created_by.uid
                  ? 'You'
                  : point.created_by.display_name}
              </MaybeLinked>
            </Text>{' '}
            gave{' '}
            <MaybeLinked
              href={`/users/${point.subject.uid}/profile`}
              isLinked={point.subject.uid !== currentUserUid}
            >
              <Text
                as="span"
                fontWeight={point.subject.uid !== currentUserUid ? 700 : 400}
              >
                {currentUserUid === point.subject.uid
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
