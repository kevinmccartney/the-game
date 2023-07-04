import {
  Avatar,
  Box,
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
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { AssignPointsForm, User } from '@the-game/client/the-game-ui/models';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  UseFormSetValue,
} from 'react-hook-form';

const getUsers = async (
  search: string,
  auth: any,
  setUsers: any,
  setIsLoading: any,
) => {
  const token = await auth.currentUser?.getIdToken();

  const usersReq = await fetch(
    `https://api.the-game.kevinmccartney.dev/v1/users?name=${search}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const users = await usersReq.json();

  setUsers(users);
  setIsLoading(false);
};

const debouncedSearch = debounce(getUsers, 500);

export const UserSearchField = ({
  register,
  setValue,
  errors,
  containerProps,
  form,
}: {
  register: UseFormRegister<AssignPointsForm>;
  setValue: UseFormSetValue<AssignPointsForm>;
  errors: FieldErrors<AssignPointsForm>;
  containerProps?: any;
  form: UseFormReturn<AssignPointsForm, any, undefined>;
}) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    setIsLoading(true);
    getUsers('', auth, setUsers, setIsLoading);
  }, []);

  useOutsideClick({
    ref: fieldRef,
    handler: (event) => {
      if (suggestionsOpen) {
        setSuggestionsOpen(false);
      }
    },
  });

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    setValue('subject', user.uid);
    form.trigger('subject');

    setSearchTerm(user?.display_name ?? '');
    setSuggestionsOpen(false);
  };

  const handleFocus = () => {
    if (!selectedUser) {
      setSuggestionsOpen(true);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (selectedUser) {
      if (event.code === 'Backspace') {
        clearSelectedUser();

        return;
      }

      event.preventDefault();
    }
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setSearchTerm('');
    setUsers([]);
    inputRef.current?.focus();
    setSuggestionsOpen(true);
    setValue('subject', '');
    setIsLoading(true);
    getUsers('', auth, setUsers, setIsLoading);
  };

  return (
    <FormControl
      ref={fieldRef}
      isInvalid={!!errors.subject}
      {...containerProps}
    >
      <FormLabel>User</FormLabel>
      <InputGroup>
        {selectedUser && (
          <InputLeftElement
            pointerEvents="none"
            top={1}
            left={1}
          >
            <Avatar
              size="sm"
              name={selectedUser.display_name}
              src={selectedUser.photo_url || ''}
              referrerPolicy="no-referrer"
            />
          </InputLeftElement>
        )}
        <Input
          onChange={(event) => {
            setSearchTerm(event.target.value);
            debouncedSearch(event.target.value, auth, setUsers, setIsLoading);
          }}
          placeholder="Search for a friend..."
          _placeholder={{
            color: errors.subject?.type === 'required' ? 'red.500' : 'gray.400',
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeydown}
          ref={inputRef}
          value={searchTerm}
          backgroundColor={selectedUser ? 'green.100' : 'initial'}
          borderColor={errors.subject ? 'red.500' : 'gray.200'}
          className={errors.subject ? 'hover:border-red-500' : ''}
          // p={6}
          size="lg"
          pl={selectedUser ? 12 : 6}
        />
        <Input
          {...register('subject', { required: 'Required' })}
          display="none"
        />
        {selectedUser && (
          <InputRightElement
            top={1}
            right={2}
          >
            <Button
              colorScheme="green"
              variant="ghost"
              onClick={clearSelectedUser}
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
        <MenuButton></MenuButton>
        {users.length > 0 && !isLoading && (
          <MenuList rootProps={{ style: { width: '100%' } }}>
            {users.map((result, index) => {
              const user = result as unknown as User;
              const Icon = () =>
                (user as any).icon ? (
                  <Avatar icon={(user as any).icon} />
                ) : (
                  <Avatar
                    name={user.display_name}
                    src={user.photo_url || ''}
                    referrerPolicy="no-referrer"
                  />
                );

              return (
                <MenuItem
                  icon={<Icon />}
                  mt={index === 0 ? 4 : 0}
                  borderBottomColor="gray.200"
                  borderBottomWidth={index === users.length - 1 ? 0 : 1}
                  key={user.uid}
                  onClick={() => handleSelect(user)}
                  isDisabled={!!(user as any).isDisabled}
                >
                  {user.display_name}
                </MenuItem>
              );
            })}
          </MenuList>
        )}
        {users.length == 0 && !isLoading && <Text>No results</Text>}
        {isLoading && <Text>Loading...</Text>}
      </Menu>
    </FormControl>
  );
};
