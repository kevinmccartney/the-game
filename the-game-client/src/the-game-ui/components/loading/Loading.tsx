import { Box } from '@chakra-ui/react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Loading = ({ size }: { size: string }) => (
  <Box
    color="purple.500"
    fontSize={size}
  >
    <FontAwesomeIcon
      icon={faSpinner}
      spin
    />
  </Box>
);

Loading.defaultProps = {
  size: '4xl',
};
