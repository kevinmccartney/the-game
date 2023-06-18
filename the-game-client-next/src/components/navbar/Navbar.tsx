import React from 'react';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faDice } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export const Navbar = () => (
  <Flex
    bg="purple.500"
    p="4"
    role="navigation"
    justifyContent="space-between"
  >
    <Link href="/">
      <FontAwesomeIcon
        icon={faDice}
        inverse
        size="2x"
      />
    </Link>
    <Menu>
      <MenuButton
        as={Button}
        colorScheme="transparent"
      >
        <FontAwesomeIcon
          icon={faCircleUser}
          inverse
          size="2x"
        />
      </MenuButton>
      <MenuList>
        <Link href="/login/">
          <MenuItem>Login</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  </Flex>
);
