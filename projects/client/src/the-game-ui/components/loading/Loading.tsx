import { Box } from '@chakra-ui/react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Loading = ({ size }: Readonly<{ size: string }>) => (
  <Box
    color="purple.500"
    fontSize={size}
  >
    <FontAwesomeIcon
      icon={faSpinner}
      spin={true}
    />
  </Box>
);

const defaultProps: Readonly<{ size: string }> = {
  size: '4xl',
};

Loading.defaultProps = defaultProps;
