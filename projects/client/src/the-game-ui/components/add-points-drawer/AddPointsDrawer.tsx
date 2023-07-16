import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'lodash-es';
import React, { FunctionComponent, PropsWithChildren } from 'react';

export const AddPointsDrawer: FunctionComponent<
  PropsWithChildren<{
    finalFocusRef?: React.MutableRefObject<any>;
    isOpen: boolean;
    onClose?: () => void;
  }>
> = ({ children, finalFocusRef, isOpen, onClose }) => (
  <Drawer
    finalFocusRef={finalFocusRef}
    isOpen={isOpen}
    onClose={onClose || noop}
    placement="right"
    size="full"
  >
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton color="white">
        <FontAwesomeIcon
          icon={faXmark}
          inverse={true}
          size="2x"
        />
      </DrawerCloseButton>
      <DrawerHeader
        backgroundColor="purple.500"
        color="white"
      >
        Assign Points
      </DrawerHeader>

      <DrawerBody>{children}</DrawerBody>
    </DrawerContent>
  </Drawer>
);

AddPointsDrawer.defaultProps = {
  finalFocusRef: undefined,
  onClose: noop,
};
