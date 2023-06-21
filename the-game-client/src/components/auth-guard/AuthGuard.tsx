'use client';

import { Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
// import publicPaths from '../data/publicPaths';
// import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
// import { setRedirectLink } from '../redux/AuthSlice';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { getAuth } from 'firebase/auth';

export const AuthGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) => {
  const { children } = props;

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  // const user = useAppSelector((state) => state.auth);

  // const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();

    const authCheck = () => {
      if (!auth.currentUser) {
        setAuthorized(false);
        // dispatch(setRedirectLink({ goto: router.asPath }));
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
  }, [router, router.events]);

  return authorized ? (
    children
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
