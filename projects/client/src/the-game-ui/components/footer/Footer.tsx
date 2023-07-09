import { Flex, Link, Text } from '@chakra-ui/react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

// testing formatting and linting
export const Footer = () => {
    return (
  <Flex
    bg="gray.800"
    justifyContent="center"
    p="4"
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
      color="blue.400"
      href="https://github.com/kevinmccartney"
      isExternal={true}
      ml={1}
    >
      Kevin McCartney
    </Link>
  </Flex>
)};
