/**
 * Project vite (base-components)
 */

import { useEffect, useRef, type FC, type PropsWithChildren, type RefObject } from 'react';

import { createPortal } from 'react-dom';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  isVisible?: boolean;
  closeOnClickOutside?: boolean;
  childRef: RefObject<HTMLElement>;
  onClose?: () => void;
  'data-testid'?: string;
}

/**
 * Screen component
 */
const Screen: FC<PropsWithChildren<Props>> = ({
  className,
  isVisible,
  closeOnClickOutside,
  onClose,
  children,
  childRef,
  ...rest
}) => {
  const screenRef = useRef<HTMLDivElement>(null);

  // Close modal when clicked outside
  useEffect(() => {
    const _screenRef = screenRef;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!childRef.current?.contains(event.target as Node) && closeOnClickOutside) {
        onClose?.();
      }
    };

    _screenRef.current?.addEventListener('click', listener);
    _screenRef.current?.addEventListener('touchstart', listener);

    return () => {
      _screenRef.current?.removeEventListener('click', listener);
      _screenRef.current?.removeEventListener('touchstart', listener);
    };
  }, [childRef, onClose, closeOnClickOutside]);

  return isVisible
    ? createPortal(
        <div
          ref={screenRef}
          className={[styles.screen, className].filter(Boolean).join(' ')}
          data-testid={rest['data-testid']}
          data-theme
        >
          {children}
        </div>,
        document.getElementById('root')!,
      )
    : null;
};
export default Screen;
