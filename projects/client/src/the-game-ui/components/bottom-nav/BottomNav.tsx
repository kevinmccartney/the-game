import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { NAVIGATION_ITEMS } from '@the-game/ui/constants';
import { ActiveNavigationContext } from '@the-game/ui/contexts';
import { NavigationItem } from '@the-game/ui/models';

export const BottomNav = (props: { [key: string]: any }) => {
  const router = useRouter();
  const activeNavigation = useContext(ActiveNavigationContext);

  const handleClick = (item: NavigationItem) => {
    void router.push(item.path);
  };

  return (
    <Flex
      alignItems="center"
      backgroundColor="purple.500"
      border={0}
      bottom={0}
      justifyContent="center"
      position="sticky"
      {...props}
    >
      <ButtonGroup gap={{ sm: 4 }}>
        {NAVIGATION_ITEMS.map((x) => (
          <Button
            borderRadius={0}
            colorScheme="purple"
            h="auto"
            isActive={activeNavigation === x.id}
            key={uuidV4()}
            onClick={() => handleClick(x)}
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
