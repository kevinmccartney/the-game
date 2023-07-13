'use client';

import { Flex } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { Loading } from '@the-game/ui/components/loading';

export const AuthGuard = (
  props: Readonly<{
    children: Readonly<
      ReactElement<unknown, JSXElementConstructor<unknown> | string>[]
    >;
  }>,
) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const authCheck = () => {
      if (!auth.currentUser) {
        setAuthorized(false);

        // TODO: can there be an error thrown from this? fire & forget appropriate?
        void router.push({
          pathname: '/unauthorized',
        });
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on('routeChangeStart', preventAccess);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return authorized ? (
    props?.children
  ) : (
    <Flex
      alignItems="center"
      h="100%"
      justifyContent="center"
      w="100%"
    >
      <Loading />
    </Flex>
  );
};
