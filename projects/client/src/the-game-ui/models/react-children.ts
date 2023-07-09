import { JSXElementConstructor, ReactElement } from 'react';

export type ReactChildren =
  | Readonly<ReactElement<unknown, JSXElementConstructor<unknown> | string>>
  | Readonly<ReactElement<unknown, JSXElementConstructor<unknown> | string>[]>
  | string;
