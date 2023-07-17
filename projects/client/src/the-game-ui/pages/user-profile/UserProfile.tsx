'use client';

import { Flex } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';

import { AuthGuard, BackButton } from '@the-game/ui/components';
import { MeProfile } from '@the-game/ui/pages/user-profile/MeProfile';

export const UserProfile: FunctionComponent<{
  type?: 'anonymous' | 'friend' | 'me';
}> = ({ type }) => (
  <AuthGuard>
    <Helmet>
      <title>The Game | Profile</title>
    </Helmet>
    <Flex
      flexDirection="column"
      py={8}
    >
      <BackButton buttonProps={{ alignSelf: 'flex-start', mb: 6 }} />
      {type === 'me' && <MeProfile />}
    </Flex>
  </AuthGuard>
);

UserProfile.defaultProps = {
  type: 'anonymous',
};
