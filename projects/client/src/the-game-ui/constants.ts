import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faCog, faHome, faUserGroup } from '@fortawesome/free-solid-svg-icons';

import { NavigationItem } from '@the-game/ui/models';

export const NAVIGATION_ITEMS: ReadonlyArray<NavigationItem> = [
  {
    icon: faHome,
    id: 'home',
    label: 'Home',
    path: '/',
  },
  {
    icon: faUserGroup,
    id: 'friends',
    label: 'Friends',
    path: '/friends',
  },
  {
    icon: faAddressCard,
    id: 'profile',
    label: 'Profile',
    path: `/profile/me`,
  },
  {
    icon: faCog,
    id: 'settings',
    label: 'Settings',
    path: '/settings',
  },
];
