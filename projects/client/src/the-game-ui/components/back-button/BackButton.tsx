import { Button } from '@chakra-ui/react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';

export const BackButton: FunctionComponent<{
  buttonProps?: { [key: string]: any };
}> = ({ buttonProps }) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button
      colorScheme="blue"
      leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
      onClick={handleClick}
      variant="link"
      {...buttonProps}
    >
      Back
    </Button>
  );
};

BackButton.defaultProps = {
  buttonProps: {},
};
