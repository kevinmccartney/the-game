'use client';

import React from 'react';

import { getAuth } from 'firebase/auth';
import Dashboard from '@the-game/client/the-game-ui/pages/dashboard';
import Splash from '@the-game/client/the-game-ui/pages/splash/Splash';
import { Flex } from '@chakra-ui/react';

const AppRoot = () => {
  const auth = getAuth();

  return auth.currentUser ? <Dashboard /> : <Splash />;
};

export default AppRoot;
