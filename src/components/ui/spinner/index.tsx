/**
 * Project vite (base-components)
 */

import type { FC } from 'react';

import styles from './styles.module.scss';

/**
 * Spinner component
 */
const Spinner: FC = () => <span className={styles.spinner} data-testid="spinner" data-theme />;

export default Spinner;
