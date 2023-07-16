import { MutableRefObject, createContext } from 'react';

export const ModalContext = createContext<MutableRefObject<null> | null>(null);
