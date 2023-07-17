import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type NavigationItem = {
  icon: IconDefinition;
  id: string;
  label: string;
  path: string;
};
