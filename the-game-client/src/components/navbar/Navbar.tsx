import React, { useState } from 'react';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faDice } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const auth = getAuth();
  const [isAuthed, setIsAuthed] = useState(!!auth.currentUser);

  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const logout = async () => {
    try {
      const result = await signOut(auth);
      console.log(result);
      setIsAuthed(false);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      setIsAuthed(true);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      bg="purple.500"
      p="4"
      role="navigation"
      justifyContent="space-between"
    >
      <Link href="/">
        <FontAwesomeIcon
          icon={faDice}
          inverse
          size="2x"
        />
      </Link>
      {
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="transparent"
          >
            <FontAwesomeIcon
              icon={faCircleUser}
              inverse
              size="2x"
            />
          </MenuButton>
          <MenuList>
            {isAuthed ? (
              <MenuItem onClick={logout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={login}>Login</MenuItem>
            )}
          </MenuList>
        </Menu>
      }
    </Flex>
  );
};
