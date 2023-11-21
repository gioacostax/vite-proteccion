/**
 * Project vite (base-components)
 */

import { useEffect, useRef, type FC, type PropsWithChildren, useState, useCallback } from 'react';

import { createPortal } from 'react-dom';

import styles from './styles.module.scss';

interface Props {
  targetId: string;
  isVisible: boolean;
  mode?: 'hover' | 'click';
  position?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end';
  onChange: (value: boolean) => void;
  'data-testid'?: string;
}

const findLastParentScrollTop = (element: HTMLElement | null): number => {
  if (element?.scrollTop) {
    return element.scrollTop;
  } else if (element?.parentElement) {
    return findLastParentScrollTop(element.parentElement);
  }
  return 0;
};

const findLastParentScrollLeft = (element: HTMLElement | null): number => {
  if (element?.scrollLeft) {
    return element.scrollLeft;
  } else if (element?.parentElement) {
    return findLastParentScrollLeft(element.parentElement);
  }
  return 0;
};

/**
 * Float component
 */
const Float: FC<PropsWithChildren<Props>> = ({
  isVisible,
  position = 'right',
  mode = 'hover',
  onChange,
  children,
  targetId,
  ...rest
}) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [targetStyles, setTargetStyles] = useState<{
    top: number;
    left: number;
    maxHeight: string;
    maxWidth: string;
    transform: string;
  }>({
    top: 0,
    left: 0,
    maxHeight: '',
    maxWidth: '',
    transform: '',
  });

  // Disable scrolling when child is visible
  const disableScroll = useCallback((event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    return false;
  }, []);

  // Reset target styles and hide child
  const closeChild = useCallback(() => {
    const target = document.getElementById(targetId)!;
    target.removeEventListener('wheel', disableScroll);

    target.style.position = '';
    target.style.zIndex = '';

    onChange(false);
  }, [disableScroll, onChange, targetId]);

  // Calculate new child position and show
  const showChild = useCallback(() => {
    const target = document.getElementById(targetId)!;

    target.addEventListener('wheel', disableScroll, { passive: false });

    target.style.position = 'relative';
    target.style.zIndex = '3';

    onChange(true);

    const top = target.offsetTop - findLastParentScrollTop(target);
    const left = target.offsetLeft - findLastParentScrollLeft(target);
    let maxHeight,
      maxWidth,
      transform = '';

    switch (position) {
      case 'top-start':
        maxHeight = `${top - 24}px`;
        maxWidth = `${document.body.clientWidth - left - 24}px`;
        transform = `translate(0, -100%)`;
        break;
      case 'top':
        maxHeight = `${top - 24}px`;
        maxWidth = `${left + target.offsetWidth - 24}px`; // Needs improvements
        transform = `translate(calc(-50% + (${target.offsetWidth}px / 2)), -100%)`;
        break;
      case 'top-end':
        maxHeight = `${top - 24}px`;
        maxWidth = `${left + target.offsetWidth - 24}px`;
        transform = `translate(calc(-100% + ${target.offsetWidth}px), -100%)`;
        break;
      case 'right-start':
        maxHeight = `${document.body.clientHeight - top - 24}px`;
        maxWidth = `${document.body.clientWidth - left - target.offsetWidth - 24}px`;
        transform = `translate(${target.offsetWidth}px, 0)`;
        break;
      case 'right':
        maxHeight = `${top + target.offsetHeight - 24}px`; // Needs improvements
        maxWidth = `${document.body.clientWidth - left - target.offsetWidth - 24}px`;
        transform = `translate(${target.offsetWidth}px, calc(-50% + (${target.offsetHeight}px / 2)))`;
        break;
      case 'right-end':
        maxHeight = `${top + target.offsetHeight - 24}px`;
        maxWidth = `${document.body.clientWidth - left - target.offsetWidth - 24}px`;
        transform = `translate(${target.offsetWidth}px, calc(-100% + ${target.offsetHeight}px))`;
        break;
      case 'left-start':
        maxHeight = `${document.body.clientHeight - top - 24}px`;
        maxWidth = `${left - 24}px`;
        transform = `translate(-100%, 0)`;
        break;
      case 'left':
        maxHeight = `${top + target.offsetHeight - 24}px`; // Needs improvements
        maxWidth = `${left - 24}px`;
        transform = `translate(-100%, calc(-50% + (${target.offsetHeight}px / 2)))`;
        break;
      case 'left-end':
        maxHeight = `${top + target.offsetHeight - 24}px`;
        maxWidth = `${left - 24}px`;
        transform = `translate(-100%, calc(-100% + ${target.offsetHeight}px))`;
        break;
      case 'bottom-start':
        maxHeight = `${document.body.clientHeight - top - 24 - target.offsetHeight}px`;
        maxWidth = `${document.body.clientWidth - left - 24}px`;
        transform = `translate(0, ${target.offsetHeight}px)`;
        break;
      case 'bottom':
        maxHeight = `${document.body.clientHeight - top - 24 - target.offsetHeight}px`;
        maxWidth = `${left + target.offsetWidth - 24}px`; // Needs improvements
        transform = `translate(calc(-50% + (${target.offsetWidth}px / 2)), ${target.offsetHeight}px)`;
        break;
      case 'bottom-end':
        maxHeight = `${document.body.clientHeight - top - 24 - target.offsetHeight}px`;
        maxWidth = `${left + target.offsetWidth - 24}px`;
        transform = `translate(calc(-100% + ${target.offsetWidth}px), ${target.offsetHeight}px)`;
        break;
    }

    if (
      top !== targetStyles.top ||
      left !== targetStyles.left ||
      maxHeight !== targetStyles.maxHeight ||
      maxWidth !== targetStyles.maxWidth ||
      transform !== targetStyles.transform
    ) {
      setTargetStyles({
        top,
        left,
        maxHeight,
        maxWidth,
        transform,
      });
    }
  }, [
    disableScroll,
    onChange,
    position,
    targetId,
    targetStyles.left,
    targetStyles.maxHeight,
    targetStyles.maxWidth,
    targetStyles.top,
    targetStyles.transform,
  ]);

  const clickTarget = useCallback(
    (e: MouseEvent) => {
      if (isVisible) closeChild();
      else showChild();
      e.preventDefault();
    },
    [closeChild, isVisible, showChild],
  );

  const clickScreen = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!childRef.current?.contains(event.target as Node)) {
        closeChild();
      }
    },
    [closeChild],
  );

  useEffect(() => {
    const target = document.getElementById(targetId)!;
    const _screenRef = screenRef.current;

    if (mode === 'click') {
      target.addEventListener('click', clickTarget);
      _screenRef?.addEventListener('click', clickScreen);
      _screenRef?.addEventListener('touchstart', clickScreen);
    } else {
      target.addEventListener('mouseover', showChild);
      target.addEventListener('mouseout', closeChild);
    }

    return () => {
      target.removeEventListener('click', clickTarget);
      target.removeEventListener('mouseover', showChild);
      target.removeEventListener('mouseout', closeChild);
      _screenRef?.removeEventListener('click', clickScreen);
      _screenRef?.removeEventListener('touchstart', clickScreen);
    };
  }, [clickScreen, clickTarget, closeChild, mode, showChild, targetId]);

  return isVisible
    ? createPortal(
        <div ref={screenRef} className={styles.screen} data-testid="float-screen">
          <div
            ref={childRef}
            className={styles.container}
            role="menu"
            tabIndex={0}
            style={targetStyles}
            data-testid={rest['data-testid']}
            data-theme
          >
            {children}
          </div>
        </div>,
        document.getElementById('root')!,
      )
    : null;
};
export default Float;
