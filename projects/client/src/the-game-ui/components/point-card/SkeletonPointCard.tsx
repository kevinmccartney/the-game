import {
  Box,
  Card,
  CardBody,
  CardHeader,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { uniqueId } from 'lodash-es';
import React from 'react';

export const SkeletonPointCard = () => (
  <Card
    boxShadow="lg"
    flexDirection="row"
    key={uniqueId()}
  >
    <CardHeader>
      <SkeletonCircle size="12" />
    </CardHeader>
    <CardBody>
      <Box flexDirection="column">
        <SkeletonText
          noOfLines={3}
          skeletonHeight="3"
          spacing="4"
        />
      </Box>
    </CardBody>
  </Card>
);
