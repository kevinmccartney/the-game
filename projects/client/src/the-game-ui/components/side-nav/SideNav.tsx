import { Link } from '@chakra-ui/next-js';
import { Flex, List, ListItem, Text } from '@chakra-ui/react';
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

export const SideNav = (props: { [key: string]: any }) => {
  const router = useRouter();
  const auth = getAuth();

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
      backgroundColor="white"
      borderColor="gray.300"
      borderRightWidth={1}
      p={6}
      {...props}
    >
      <List
        flexDirection="column"
        fontSize="xl"
        gap={4}
      >
        {items.map((x) => (
          <ListItem p={2}>
            <Link
              _hover={{
                color: 'purple.500',
              }}
              borderRadius={0}
              color={router.pathname === x.pathMapping ? 'purple.500' : 'black'}
              h="auto"
              href={x.path}
            >
              <Flex alignItems="center">
                <FontAwesomeIcon icon={x.icon} />
                <Text ml={3}>{x.label}</Text>
              </Flex>
            </Link>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};
