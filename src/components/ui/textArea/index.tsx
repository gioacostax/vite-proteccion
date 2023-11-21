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
  type ChangeEvent,
} from 'react';

import styles from './styles.module.scss';

interface Props {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  keyPattern?: RegExp;
  variant?: 'normal' | 'ghost';
  resolver?: (value: string) => string;
  'data-testid'?: string;
}

/**
 * TextArea component
 */
const TextArea: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  Props & ComponentPropsWithoutRef<'textarea'>
> = (
  {
    style,
    className,
    label,
    helper,
    error,
    keyPattern,
    variant = 'normal',
    onInput,
    resolver,
    ...rest
  },
  ref,
) => {
  const prevValue = useRef(rest.value);

  // Validate keyPattern/resolver when input changes
  const handleOnInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (keyPattern && event.currentTarget.value) {
      if (keyPattern.test(event.currentTarget.value)) {
        if (resolver) event.currentTarget.value = resolver(event.currentTarget.value);
        prevValue.current = event.currentTarget.value;
      }
      event.currentTarget.value = prevValue.current as string;
    } else {
      if (resolver) event.currentTarget.value = resolver(event.currentTarget.value);
      prevValue.current = event.currentTarget.value;
    }
    onInput?.(event);
  };

  return (
    <label
      style={style}
      className={[styles.textarea, styles[variant], className].filter(Boolean).join(' ')}
      data-error={error !== null && error !== undefined}
      data-disabled={!!rest.disabled}
      data-theme
    >
      {label && (
        <span data-label className={styles.label}>
          {label}
        </span>
      )}
      <textarea ref={ref} onInput={handleOnInput} {...rest} />
      {(error ?? helper) && <div className={styles.helper}>{error ?? helper}</div>}
    </label>
  );
};

export default memo(forwardRef(TextArea));
