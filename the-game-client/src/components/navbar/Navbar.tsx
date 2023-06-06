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
import { Link } from 'react-router-dom';

import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

export const Navbar = () => (
  <Flex
    bg="purple.500"
    p="4"
    role="navigation"
    justifyContent="space-between"
  >
    <Link to={`/`}>
      <FontAwesomeIcon
        icon={icon({ name: 'dice' })}
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
          icon={icon({ name: 'circle-user' })}
          inverse
          size="2x"
        />
      </MenuButton>
      <MenuList>
        <Link to={`/login`}>
          <MenuItem>Login</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  </Flex>
);
