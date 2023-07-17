import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Tag,
  Text,
} from '@chakra-ui/react';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { EditProfileForm, EditProfileFormKey } from '@the-game/ui/models';

export const MultipleInput: FunctionComponent<{
  errors: FieldErrors<EditProfileForm>;
  fieldName: string;
  label: string;
  register: UseFormRegister<EditProfileForm>;
  setValue: UseFormSetValue<EditProfileForm>;
}> = ({ errors, fieldName, label, register, setValue }) => {
  const [selections, setSelections] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSelections([...selections, inputValue]);
      setValue(fieldName as any, [...selections, inputValue].join(','));

      setInputValue('');

      inputRef.current?.focus();
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value || '');
  };

  const handleClearInputClick = () => {
    setInputValue('');

    inputRef.current?.focus();
  };

  const handleSelectionDelete = (x: string) => {
    const newSelections = selections.filter((y) => x !== y);
    setSelections(newSelections);
    setValue(fieldName as any, newSelections.join(','));
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          onChange={handleChange}
          onKeyDown={handleKeydown}
          ref={inputRef}
          type="text"
          value={inputValue}
        />
        {inputValue && (
          <InputRightElement>
            <Button
              colorScheme="red"
              onClick={handleClearInputClick}
              variant="ghost"
            >
              <FontAwesomeIcon icon={faX} />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {errors[fieldName as EditProfileFormKey] && (
        <FormErrorMessage>
          {errors[fieldName as EditProfileFormKey]?.message}
        </FormErrorMessage>
      )}
      <Input
        display="none"
        {...register(fieldName as any)}
      />
      <List
        display="flex"
        flexWrap="wrap"
        gap={6}
        mt={6}
      >
        {selections.map((x) => (
          <ListItem key={x}>
            <Tag
              borderRadius="full"
              colorScheme="gray"
              variant="subtle"
            >
              <Text pl={4}>{x} </Text>
              <Button
                colorScheme="red"
                onClick={() => handleSelectionDelete(x)}
                variant="ghost"
              >
                <FontAwesomeIcon icon={faX} />
              </Button>
            </Tag>
          </ListItem>
        ))}
      </List>
    </FormControl>
  );
};
