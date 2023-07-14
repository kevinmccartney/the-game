import { Alert, AlertIcon, Flex, Tab, TabList, Tabs } from '@chakra-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import {
  PointCard,
  SkeletonPointCard,
} from '@the-game/ui/components/point-card';
import { useGetPointsQuery } from '@the-game/ui/services';

export const PointsFeed: FunctionComponent<{
  onTypeChange?: (type: string) => void;
  uid: string;
}> = ({ onTypeChange, uid }) => {
  const [pointsFilter, setPointsFilter] = useState('all');

  const { data: pointsData, isLoading: pointsIsLoading } = useGetPointsQuery({
    type: pointsFilter,
    userId: uid,
  });

  const onPointsFilterChange = (index: number) => {
    const filters = ['all', 'received', 'sent'];

    setPointsFilter(filters[index]);

    if (onTypeChange) {
      onTypeChange(filters[index]);
    }
  };

  return (
    <Flex
      flexDirection="column"
      gap={8}
    >
      <Tabs
        colorScheme="blue"
        onChange={onPointsFilterChange}
        variant="soft-rounded"
      >
        <TabList>
          <Tab>All</Tab>
          <Tab>Received</Tab>
          <Tab>Sent</Tab>
        </TabList>
      </Tabs>
      {pointsIsLoading &&
        [...Array(3).keys()].map(() => <SkeletonPointCard key={uuidV4()} />)}
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
  );
};

PointsFeed.defaultProps = {
  onTypeChange: () => {},
};
