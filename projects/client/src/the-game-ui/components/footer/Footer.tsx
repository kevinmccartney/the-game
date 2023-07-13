import { Flex, Link, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';

export const Footer: FunctionComponent<
  Readonly<{
    inverse?: boolean;
  }>
> = ({ inverse }) => (
  <Flex
    bgColor={inverse ? 'gray.800' : undefined}
    justifyContent="center"
    p="4"
    role="contentinfo"
  >
    <Text color={inverse ? 'white' : 'black'}>
      Made with 🖕 by{' '}
      <Link
        color="blue.400"
        href="https://github.com/kevinmccartney"
        isExternal={true}
        ml={1}
      >
        Kevin McCartney
      </Link>
    </Text>
  </Flex>
);
