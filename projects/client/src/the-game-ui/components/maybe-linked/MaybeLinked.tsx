import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

export type MaybeLinkedProps = Readonly<
  PropsWithChildren<{
    href: string;
    isLinked: boolean;
  }>
>;

export const MaybeLinked = ({
  children,
  href,
  isLinked,
}: Readonly<MaybeLinkedProps>) =>
  isLinked ? <Link href={href}>{children}</Link> : children;
