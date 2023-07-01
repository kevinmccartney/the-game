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
import { Point } from '@the-game/client/the-game-ui/models';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const PointCard = ({ point }: { point: Point }) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcZonedTime = utcToZonedTime(point.created_time, timezone);
  const formattedDistance = formatDistanceToNow(utcZonedTime);

  const pointsColor = point.points > 0 ? 'green.500' : 'red.500';

  return (
    <Card
      key={point.id}
      flexDirection="row"
      boxShadow="lg"
    >
      <CardHeader>
        <Avatar
          name={point.created_by.display_name}
          src={point.created_by.photo_url || ''}
          referrerPolicy="no-referrer"
        />
      </CardHeader>
      <CardBody>
        <Box flexDirection="column">
          <Heading
            as="h3"
            fontSize="l"
            fontWeight={400}
          >
            <Text
              fontWeight={700}
              as="span"
            >
              {point.created_by.display_name}
            </Text>{' '}
            gave You{' '}
            <Box
              as="span"
              color={pointsColor}
              fontWeight={700}
            >
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
            mt={4}
            ml={4}
            fontSize="xl"
            fontStyle="italic"
          >
            &ldquo;{point.reason}&ldquo;
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};
