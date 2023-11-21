/**
 * Project vite (base-components)
 */

import type { FC, PropsWithChildren, ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
  label: ReactNode;
}

/**
 * Field component
 */
const Field: FC<PropsWithChildren<Props>> = ({ label, children }) => (
  <div className={styles.field}>
    <h5>{label}</h5>
    <span>{children}</span>
  </div>
);

export default Field;
