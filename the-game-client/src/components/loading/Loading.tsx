import { Flex, Spinner } from '@chakra-ui/react';

export const Loading = () => (
  <Flex
    h="100vh"
    w="100vw"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner size="xl" />
  </Flex>
);
