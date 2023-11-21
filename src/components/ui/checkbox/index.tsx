/**
 * Project vite (base-components)
 */

import {
  forwardRef,
  memo,
  type ComponentPropsWithoutRef,
  type ForwardRefRenderFunction,
} from 'react';

import styles from './styles.module.scss';

interface Props {
  isReverse?: boolean;
  indeterminate?: boolean;
  isError?: boolean;
  'data-testid'?: string;
}

/**
 * Checkbox component
 */
const Checkbox: ForwardRefRenderFunction<
  HTMLInputElement,
  Props & ComponentPropsWithoutRef<'input'>
> = ({ style, className, children, isReverse, indeterminate, isError, ...rest }, ref) => (
  <label
    style={style}
    className={[styles.checkbox, className].filter(Boolean).join(' ')}
    data-disabled={!!rest.disabled}
    data-error={!!isError}
    data-reverse={!!isReverse}
    data-theme
  >
    <input ref={ref} type="checkbox" data-indeterminate={indeterminate} {...rest} />
    {children}
  </label>
);

export default memo(forwardRef(Checkbox));
