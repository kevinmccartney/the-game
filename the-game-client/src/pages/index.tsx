'use client';

import React from 'react';

import { getAuth } from 'firebase/auth';
import Dashboard from '@the-game/client/components/dashboard';
import Splash from '@the-game/client/components/splash/Splash';

const AppRoot = () => {
  const auth = getAuth();

  return auth.currentUser ? <Dashboard /> : <Splash />;
};

export default AppRoot;
