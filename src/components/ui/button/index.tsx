/**
 * Project vite (base-components)
 */

import {
  forwardRef,
  memo,
  type ComponentPropsWithoutRef,
  type ForwardRefRenderFunction,
  type ReactNode,
} from 'react';

import styles from './styles.module.scss';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'box' | 'border' | 'ghost' | 'text';
  theme?: 'primary' | 'secondary' | 'danger' | 'success';
  leading?: ReactNode;
  trailing?: ReactNode;
  'data-testid'?: string;
}

/**
 * Button component
 */
const Button: ForwardRefRenderFunction<
  HTMLButtonElement,
  Props & ComponentPropsWithoutRef<'button'>
> = (
  {
    children,
    className,
    size = 'md',
    variant = 'box',
    theme = 'primary',
    leading,
    trailing,
    ...rest
  },
  ref,
) => (
  <button
    ref={ref}
    className={[styles.button, styles[size], styles[variant], styles[theme], className]
      .filter(Boolean)
      .join(' ')}
    type="button"
    data-theme
    {...rest}
  >
    {leading && <span className={styles.leading}>{leading}</span>}
    {children}
    {trailing && <span className={styles.trailing}>{trailing}</span>}
  </button>
);

export default memo(forwardRef(Button));
