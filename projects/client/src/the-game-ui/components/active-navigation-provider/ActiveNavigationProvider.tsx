import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { ActiveNavigationContext } from '@the-game/ui/contexts';

export const ActiveNavigationProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const routeMap: { [key: string]: string } = {
    '/': 'home',
    '/friends': 'friends',
    '/profile/me': 'profile',
    '/settings': 'settings',
  };
  const [activeRoute, setActiveRoute] = useState(routeMap[router.asPath]);

  useEffect(() => {
    router.events.on('routeChangeComplete', (e: string) => {
      setActiveRoute(routeMap[e]);
    });

    return () => {
      router.events.off('routeChangeComplete', (e: string) => {
        setActiveRoute(routeMap[e]);
      });
    };
  }, [router.events]);

  return (
    <ActiveNavigationContext.Provider value={activeRoute}>
      {children}
    </ActiveNavigationContext.Provider>
  );
};
