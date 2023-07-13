import { Flex } from '@chakra-ui/react';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

import { useScrollDirection } from '@the-game/ui/hooks/useScrollDirection';

export const Header = (props: { [key: string]: any }) => {
  const scrollDirection = useScrollDirection();
  return (
    <Flex
      className={`sticky ${
        scrollDirection === 'down' ? '-top-20' : 'top-0'
      } transition-all duration-500`}
      bg="purple.500"
      h={16}
      justifyContent="space-between"
      p="4"
      role="navigation"
      top={scrollDirection === 'down' ? -16 : 0}
      zIndex="sticky"
      {...props}
    >
      <Link href="/">
        <FontAwesomeIcon
          icon={faDice}
          inverse={true}
          size="2x"
        />
      </Link>
    </Flex>
  );
};
