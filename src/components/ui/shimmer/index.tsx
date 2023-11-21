/**
 * Project vite (base-components)
 */

import { memo, type CSSProperties, type FC } from 'react';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  style?: CSSProperties;
  height?: number | string;
  width?: number | string;
  'data-testid'?: string;
}

/**
 * Shimmer component
 */
const Shimmer: FC<Props> = ({ height = '2em', width = '100%', style, ...rest }) => (
  <div
    style={{ height, width, ...style }}
    className={[styles.shimmer, rest.className].filter(Boolean).join(' ')}
    data-testid={rest['data-testid']}
    data-theme
  />
);

export default memo(Shimmer);
