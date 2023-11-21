/**
 * Project vite (base-components)
 */

import {
  forwardRef,
  memo,
  useRef,
  type ComponentPropsWithoutRef,
  type ForwardRefRenderFunction,
  type ReactNode,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';

import styles from './styles.module.scss';

export interface Props {
  label?: ReactNode;
  helper?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  error?: ReactNode;
  keyPattern?: RegExp;
  variant?: 'normal' | 'ghost';
  resolver?: (value: string) => string;
  preventDefault?: boolean;
  'data-testid'?: string;
}

/**
 * TextField component
 */
const TextField: ForwardRefRenderFunction<
  HTMLInputElement,
  Props & ComponentPropsWithoutRef<'input'>
> = (
  {
    style,
    className,
    label,
    helper,
    leading,
    trailing,
    error,
    keyPattern,
    variant = 'normal',
    onInput,
    resolver,
    preventDefault,
    onKeyDown,
    ...rest
  },
  ref,
) => {
  const prevValue = useRef(rest.value);

  // Prevent default event when user presses enter
  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (preventDefault && event.code === 'Enter') event.preventDefault();
    onKeyDown?.(event);
  };

  // Validate keyPattern/resolver when input changes
  const handleOnInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (keyPattern && e.currentTarget.value) {
      if (keyPattern.test(e.currentTarget.value)) {
        if (resolver) e.currentTarget.value = resolver(e.currentTarget.value);
        prevValue.current = e.currentTarget.value;
      }
      e.currentTarget.value = prevValue.current as string;
    } else {
      if (resolver) e.currentTarget.value = resolver(e.currentTarget.value);
      prevValue.current = e.currentTarget.value;
    }
    onInput?.(e);
  };

  return (
    <label
      style={style}
      className={[styles.textfield, styles[variant], className].filter(Boolean).join(' ')}
      data-error={error !== null && error !== undefined}
      data-disabled={!!rest.disabled}
      data-theme
    >
      {label && (
        <span data-label className={styles.label}>
          {label}
        </span>
      )}
      <div className={styles.container}>
        {leading && <span className={styles.leading}>{leading}</span>}
        <input ref={ref} onKeyDown={handleOnKeyDown} onInput={handleOnInput} {...rest} />
        {trailing && <span className={styles.trailing}>{trailing}</span>}
      </div>
      {(error ?? helper) && <div className={styles.helper}>{error ?? helper}</div>}
    </label>
  );
};

export default memo(forwardRef(TextField));
