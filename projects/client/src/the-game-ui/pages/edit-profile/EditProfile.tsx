'use client';

import {
  Card,
  CardBody,
  Flex,
  Input,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { AuthGuard } from '@the-game/ui/components';
import { DefaultContainer } from '@the-game/ui/layouts';

export const EditProfile = () => {
  const [searchType, setSearchType] = useState('friends');
  const onTabChange = (index: number) => {
    const searchTypes = ['friends', 'all'];

    setSearchType(searchTypes[index]);
  };

  console.log(searchType);

  // search with search type

  return (
    <AuthGuard>
      <Helmet>
        <title>The Game | Friends</title>
      </Helmet>
      <DefaultContainer>
        <Flex flexDirection="column">
          <Tabs
            colorScheme="blue"
            onChange={onTabChange}
            variant="soft-rounded"
          >
            <TabList>
              <Tab>🥰 My Friends</Tab>
              <Tab>🔎 Find Friends</Tab>
            </TabList>
          </Tabs>
          <Card>
            <CardBody>
              <Input />
            </CardBody>
          </Card>
        </Flex>
      </DefaultContainer>
    </AuthGuard>
  );
};
