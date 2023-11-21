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
  trueLabel?: string;
  falseLabel?: string;
  isError?: boolean;
  'data-testid'?: string;
}

/**
 * Toggle component
 */
const Toggle: ForwardRefRenderFunction<
  HTMLInputElement,
  Props & ComponentPropsWithoutRef<'input'>
> = ({ style, className, trueLabel, falseLabel, isError, ...rest }, ref) => (
  <label
    style={style}
    className={[styles.toggle, className].filter(Boolean).join(' ')}
    data-disabled={!!rest.disabled}
    data-error={!!isError}
    data-theme
  >
    <input ref={ref} type="checkbox" {...rest} />
    <div className={styles.inner}>
      <span className={styles.true}>{trueLabel}</span>
      <span className={styles.false}>{falseLabel}</span>
    </div>
    <span className={styles.slider} />
  </label>
);

export default memo(forwardRef(Toggle));
