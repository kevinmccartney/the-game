import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useOutsideClick,
} from '@chakra-ui/react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash-es';
import React, { useRef, useState } from 'react';
import { FieldErrors, UseFormReturn } from 'react-hook-form';

import { Loading } from '@the-game/ui/components/loading';
import { AssignPointsForm, User } from '@the-game/ui/models';
import { useGetUsersQuery } from '@the-game/ui/services';

const bufferSearchTermInner = (
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
) => {
  setSearchTerm(searchTerm);
};

const bufferSearchTerm = debounce(bufferSearchTermInner, 500);

export const UserSearchField = ({
  containerProps,
  errors,
  form,
}: Readonly<{
  containerProps?: Readonly<any>;
  errors: Readonly<FieldErrors<AssignPointsForm>>;
  form: Readonly<UseFormReturn<AssignPointsForm, any, undefined>>;
}>) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const fieldRef = useRef(null);

  form.watch((value) => {
    if (!value.subject && selectedUser) {
      setSelectedUser(null);
    }
  });

  const { data: usersData, isLoading: usersIsLoading } = useGetUsersQuery({
    name: searchTerm,
  });

  useOutsideClick({
    handler: () => {
      if (suggestionsOpen) {
        setSuggestionsOpen(false);
      }
    },
    ref: fieldRef,
  });

  const handleSelect = async (user: Readonly<User>) => {
    setSelectedUser(user);
    form.setValue('subject', user.uid);
    form.setValue('subjectDisplayName', user.display_name);
    await form.trigger('subject');

    setSuggestionsOpen(false);
  };

  const handleFocus = () => {
    setSuggestionsOpen(true);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    // TODO: restore focus to subject diplay name field
    // subjectDisplayNameRef.current?.focus(); //
    setSuggestionsOpen(true);
    form.setValue('subject', '');
    form.setValue('subjectDisplayName', '');
  };

  const handleKeydown = (event: Readonly<React.KeyboardEvent>) => {
    if (selectedUser) {
      if (event.code === 'Backspace') {
        clearSelectedUser();

        return;
      }

      event.preventDefault();
    }
  };

  const {
    name: subjectDisplayNameName,
    onBlur: subjectDisplayNameOnBlur,
    onChange: subjectDisplayNameOnChange,
    ref: subjectDisplayNameRef,
  } = form.register('subjectDisplayName');

  return (
    <FormControl
      isInvalid={!!errors.subject}
      ref={fieldRef}
      {...containerProps}
    >
      <FormLabel>User</FormLabel>
      <InputGroup>
        {selectedUser && (
          <InputLeftElement
            left={1}
            pointerEvents="none"
            top={1}
          >
            <Avatar
              name={selectedUser.display_name}
              referrerPolicy="no-referrer"
              size="sm"
              src={selectedUser.photo_url || ''}
            />
          </InputLeftElement>
        )}
        <Input
          _placeholder={{
            color: errors.subject?.type === 'required' ? 'red.500' : 'gray.400',
          }}
          onChange={(event) => {
            bufferSearchTerm(event.target.value, setSearchTerm);
            void subjectDisplayNameOnChange(event);
          }}
          backgroundColor={selectedUser ? 'green.100' : 'initial'}
          borderColor={errors.subject ? 'red.500' : 'gray.200'}
          className={errors.subject ? 'hover:border-red-500' : ''}
          name={subjectDisplayNameName}
          onBlur={void subjectDisplayNameOnBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeydown}
          pl={selectedUser ? 12 : 6}
          placeholder="Search for a friend..."
          ref={subjectDisplayNameRef}
          size="lg"
        />
        <Input
          {...form.register('subject', { required: 'Required' })}
          display="none"
        />
        {selectedUser && (
          <InputRightElement
            right={2}
            top={1}
          >
            <Button
              colorScheme="green"
              onClick={clearSelectedUser}
              variant="ghost"
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {errors.subject && (
        <FormErrorMessage>{errors.subject.message}</FormErrorMessage>
      )}
      <Menu
        isOpen={suggestionsOpen}
        offset={[0, -12]}
      >
        <MenuButton />
        {(usersData?.length || 0) > 0 && !usersIsLoading && (
          <MenuList rootProps={{ style: { width: '100%' } }}>
            {usersData?.map((result, index) => {
              const user = result;

              return (
                <MenuItem
                  icon={
                    <Avatar
                      name={user.display_name}
                      referrerPolicy="no-referrer"
                      src={user.photo_url || ''}
                    />
                  }
                  borderBottomColor="gray.200"
                  borderBottomWidth={index === usersData.length - 1 ? 0 : 1}
                  key={user.uid}
                  mt={index === 0 ? 4 : 0}
                  onClick={() => void handleSelect(user)}
                >
                  {user.display_name}
                </MenuItem>
              );
            })}
          </MenuList>
        )}
        {usersIsLoading && (
          <MenuList>
            <MenuItem
              icon={<Loading />}
              isDisabled={true}
              mt={4}
            >
              Loading...
            </MenuItem>
          </MenuList>
        )}
      </Menu>
    </FormControl>
  );
};
