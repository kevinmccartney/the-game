/* eslint-disable react/react-in-jsx-scope */

'use client';

import { getAuth } from 'firebase/auth';

import { Dashboard, Splash } from '@the-game/ui/pages';

const AppRoot = () => {
  const auth = getAuth();

  return auth.currentUser ? <Dashboard /> : <Splash />;
};

export default AppRoot;
/* eslint-enable react/react-in-jsx-scope */
