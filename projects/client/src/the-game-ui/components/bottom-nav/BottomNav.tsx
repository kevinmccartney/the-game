import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import {
  faAddressCard,
  faCog,
  faHome,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import { PATH_MAPPINGS } from '@the-game/ui/constants';

export const BottomNav = (props: { [key: string]: any }) => {
  const router = useRouter();
  const auth = getAuth();

  const handleClick = (path: string) => {
    void router.push(path);
  };

  const items = [
    {
      icon: faHome,
      label: 'Home',
      path: '/',
      pathMapping: PATH_MAPPINGS.home,
    },
    {
      icon: faUserGroup,
      label: 'Friends',
      path: '/friends',
      pathMapping: PATH_MAPPINGS.friends,
    },
    {
      icon: faAddressCard,
      label: 'Profile',
      path: `/users/${auth.currentUser?.uid || ''}/profile`,
      pathMapping: PATH_MAPPINGS.profile,
    },
    {
      icon: faCog,
      label: 'Settings',
      path: '/settings',
      pathMapping: PATH_MAPPINGS.settings,
    },
  ];

  return (
    <Flex
      alignItems="center"
      backgroundColor="purple.500"
      bottom={0}
      justifyContent="center"
      position="sticky"
      {...props}
    >
      <ButtonGroup gap={{ sm: 4 }}>
        {items.map((x) => (
          <Button
            borderRadius={0}
            colorScheme="purple"
            h="auto"
            isActive={router.pathname === x.pathMapping}
            onClick={() => handleClick(x.path)}
            py={2}
          >
            <Flex
              flexDirection="column"
              fontSize="2xl"
            >
              <FontAwesomeIcon
                icon={x.icon}
                inverse={true}
              />
              <Text
                fontSize="md"
                mt={1}
              >
                {x.label}
              </Text>
            </Flex>
          </Button>
        ))}
      </ButtonGroup>
    </Flex>
  );
};
