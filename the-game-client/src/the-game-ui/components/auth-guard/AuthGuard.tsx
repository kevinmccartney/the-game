'use client';

import { Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { getAuth } from 'firebase/auth';

export const AuthGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>[];
}) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const authCheck = () => {
      if (!auth.currentUser) {
        setAuthorized(false);

        router.push({
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
  }, [router, router.events]);

  return authorized ? (
    props?.children
  ) : (
    <Flex
      h="100vh"
      w="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="xl" />
    </Flex>
  );
};
