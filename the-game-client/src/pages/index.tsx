'use client';

import React from 'react';

import { Heading, VStack } from '@chakra-ui/react';
import { DefaultLayout } from '@the-game/client/components/layouts';
import { getAuth } from 'firebase/auth';
import Dashboard from '@the-game/client/components/dashboard';
import Splash from '@the-game/client/components/splash/Splash';
// import { useRouter } from 'next/router';
// import { getAuth } from 'firebase/auth';

const AppRoot = () => {
  const auth = getAuth();
  // const router = useRouter();
  // if (auth.currentUser) {
  //   router.replace('/dashboard');
  // }

  return auth.currentUser ? <Dashboard /> : <Splash />;
};

export default AppRoot;
