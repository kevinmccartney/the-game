import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

export const Footer = () => (
  <Flex
    bg="gray.800"
    p="4"
    justifyContent="center"
    role="contentinfo"
  >
    <Text color="white">Made with</Text>
    <Text
      color="red.400"
      ml={1}
    >
      <FontAwesomeIcon icon={icon({ name: 'heart' })} />
    </Text>
    <Text
      color="white"
      ml={1}
    >
      by
    </Text>
    <Link
      href="https://github.com/kevinmccartney"
      isExternal
      color="blue.400"
      ml={1}
    >
      Kevin McCartney
    </Link>
  </Flex>
);
