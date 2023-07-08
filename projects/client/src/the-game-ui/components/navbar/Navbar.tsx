import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { faCircleUser, faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export const Navbar = () => {
  const auth = getAuth();
  const [isAuthed, setIsAuthed] = useState(!!auth.currentUser);

  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const logout = () => {
    const requestSignout = async () => {
      try {
        await signOut(auth);

        setIsAuthed(false);
        void router.push('/');
      } catch (error) {
        console.error(error);
      }
    };

    void requestSignout();
  };

  const login = () => {
    const requestLogin = async () => {
      try {
        await signInWithPopup(auth, provider);

        setIsAuthed(true);
        void router.push('/');
      } catch (error) {
        console.error(error);
      }
    };

    void requestLogin();
  };

  return (
    <Flex
      bg="purple.500"
      justifyContent="space-between"
      p="4"
      role="navigation"
    >
      <Link href="/">
        <FontAwesomeIcon
          icon={faDice}
          inverse={true}
          size="2x"
        />
      </Link>
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="transparent"
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            inverse={true}
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
    </Flex>
  );
};
