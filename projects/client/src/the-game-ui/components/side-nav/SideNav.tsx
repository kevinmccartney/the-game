import { Button, Flex, List, ListItem, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { NAVIGATION_ITEMS } from '@the-game/ui/constants';
import { ActiveNavigationContext } from '@the-game/ui/contexts';
import { NavigationItem } from '@the-game/ui/models';

export const SideNav = (props: { [key: string]: any }) => {
  const router = useRouter();
  const activeNavigation = useContext(ActiveNavigationContext);

  const handleClick = (item: NavigationItem) => {
    void router.push(item.path);
  };

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
        {NAVIGATION_ITEMS.map((x) => (
          <ListItem
            key={uuidV4()}
            p={2}
          >
            <Button
              _hover={{
                color: 'purple.500',
              }}
              borderRadius={0}
              color={activeNavigation === x.id ? 'purple.500' : 'black'}
              h="auto"
              onClick={() => handleClick(x)}
              variant="link"
            >
              <Flex alignItems="center">
                <FontAwesomeIcon icon={x.icon} />
                <Text ml={3}>{x.label}</Text>
              </Flex>
            </Button>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};
