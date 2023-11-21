/**
 * Project vite (base-components)
 */

import type { FC, PropsWithChildren } from 'react';

import {
  UilExclamationCircle,
  UilExclamationTriangle,
  UilInfoCircle,
} from '@iconscout/react-unicons';

import styles from './styles.module.scss';

/**
 * Label component
 */

interface Props {
  type?: 'info' | 'warning' | 'danger';
}

const Label: FC<PropsWithChildren<Props>> = ({ type = 'info', children }) => {
  return (
    <div className={styles.label} data-type={type} data-theme>
      {type === 'info' && <UilInfoCircle data-testid="label-icon-info" />}
      {type === 'warning' && <UilExclamationTriangle data-testid="label-icon-warning" />}
      {type === 'danger' && <UilExclamationCircle data-testid="label-icon-danger" />}
      <p>{children}</p>
    </div>
  );
};

export default Label;
