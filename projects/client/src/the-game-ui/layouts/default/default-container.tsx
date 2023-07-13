import { Box } from '@chakra-ui/react';
import React, { FunctionComponent, PropsWithChildren } from 'react';

export const DefaultContainer: FunctionComponent<
  PropsWithChildren<{
    containerProps?: { [key: string]: string };
    sectionProps?: { [key: string]: string };
  }>
> = ({ children, containerProps, sectionProps }) => (
  <Box
    maxW={{
      lg: 'container.lg',
      md: 'container.md',
      sm: 'container.sm',
    }}
    margin="auto"
    width="100%"
    {...containerProps}
  >
    <Box
      as="section"
      height="100%"
      py={8}
      {...sectionProps}
    >
      {children}
    </Box>
  </Box>
);

DefaultContainer.defaultProps = {
  containerProps: {},
  sectionProps: {},
};
