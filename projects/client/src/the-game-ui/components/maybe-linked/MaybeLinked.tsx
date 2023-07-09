import Link from 'next/link';
import React from 'react';

import { ReactChildren } from '@the-game/ui/models';

export type MaybeLinkedProps = Readonly<{
  children: ReactChildren;
  href: string;
  isLinked: boolean;
}>;

export const MaybeLinked = ({
  children,
  href,
  isLinked,
}: Readonly<MaybeLinkedProps>) =>
  isLinked ? <Link href={href}>{children}</Link> : children;
