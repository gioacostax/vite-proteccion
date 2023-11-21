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

export interface Props {
  isReverse?: boolean;
  indeterminate?: boolean;
  isError?: boolean;
  'data-testid'?: string;
}

/**
 * Radio component
 */
const Radio: ForwardRefRenderFunction<
  HTMLInputElement,
  Props & ComponentPropsWithoutRef<'input'>
> = ({ style, className, children, isReverse, indeterminate, isError, ...rest }, ref) => (
  <label
    style={style}
    className={[styles.radio, className].filter(Boolean).join(' ')}
    data-disabled={!!rest.disabled}
    data-error={!!isError}
    data-reverse={!!isReverse}
    data-theme
  >
    <input ref={ref} type="radio" data-indeterminate={indeterminate} {...rest} />
    {children}
  </label>
);

export default memo(forwardRef(Radio));
