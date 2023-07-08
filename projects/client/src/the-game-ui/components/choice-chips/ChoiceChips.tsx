import { Button, ButtonGroup } from '@chakra-ui/react';
import React, { useState } from 'react';

export const ChoiceChips = ({
  onChange,
}: {
  onChange?: (change: string) => Promise<void> | void;
}) => {
  const [selectedChoice, setSelectedChoice] = useState('all');

  const handleClick = (choice: string) => {
    const inner = async () => {
      if (choice !== selectedChoice && onChange) {
        await onChange(choice);
      }
      setSelectedChoice(choice);
    };

    inner().catch(() => {});
  };
  return (
    <ButtonGroup>
      <Button
        colorScheme="blue"
        onClick={() => handleClick('all')}
        variant={selectedChoice === 'all' ? 'solid' : 'outline'}
      >
        All
      </Button>
      <Button
        colorScheme="blue"
        onClick={() => handleClick('received')}
        variant={selectedChoice === 'received' ? 'solid' : 'outline'}
      >
        Received
      </Button>
      <Button
        colorScheme="blue"
        onClick={() => handleClick('sent')}
        variant={selectedChoice === 'sent' ? 'solid' : 'outline'}
      >
        Sent
      </Button>
    </ButtonGroup>
  );
};

ChoiceChips.defaultProps = {
  onChange: () => {},
};
