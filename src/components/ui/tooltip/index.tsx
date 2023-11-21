/**
 * Project vite (base-components)
 */

import type { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';

import { UilInfoCircle } from '@iconscout/react-unicons';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  style?: CSSProperties;
  content?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: FC<PropsWithChildren<Props>> = ({
  className,
  style,
  content,
  position = 'top',
  children,
}) => {
  return (
    <div className={styles.tooltip} data-position={position} data-theme>
      {content ?? <UilInfoCircle size={18} color="var(--color-primary-500)" />}
      <div className={[styles.container, className].filter(Boolean).join(' ')} style={style}>
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
