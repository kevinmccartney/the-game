import { Box, Skeleton, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';

import { useGetScoresQuery } from '@the-game/ui/services';

export const Score: FunctionComponent<{
  boxProps?: { [key: string]: any };
  currentUserScore?: boolean;
  uid: string;
}> = ({ boxProps, currentUserScore, uid }) => {
  const { data: scoresData, isLoading: scoresIsLoading } =
    useGetScoresQuery(uid);
  const getScoreColor = (score: number | undefined): string | undefined =>
    score ? (score > 0 ? 'green.500' : 'red.500') : undefined;

  return (
    <Box {...boxProps}>
      {currentUserScore && (
        <Text
          fontSize="xl"
          fontWeight={400}
          textAlign="center"
        >
          You Have
        </Text>
      )}
      <Skeleton
        height={14}
        isLoaded={!scoresIsLoading}
      >
        <Text
          color={getScoreColor(scoresData)}
          fontSize="4xl"
          fontWeight={700}
          textAlign="center"
        >
          {scoresData}
        </Text>
      </Skeleton>
      <Text
        fontSize="xl"
        fontWeight={400}
        textAlign="center"
      >
        Points
      </Text>
    </Box>
  );
};

Score.defaultProps = {
  boxProps: {},
  currentUserScore: false,
};
