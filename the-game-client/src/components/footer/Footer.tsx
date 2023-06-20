import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

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
      <FontAwesomeIcon icon={faHeart} />
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
