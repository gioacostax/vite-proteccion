/**
 * Project vite (base-components)
 */

import type { FC } from 'react';

import { UilExclamationCircle } from '@iconscout/react-unicons';

import errorBg from '@/assets/images/error_bg.svg';
import Button from '@/components/ui/button';

import styles from './styles.module.scss';

interface Props {
  message: string;
  details?: string;
  useBorders?: boolean;
  handleRetry: () => void;
}

/**
 * ErrorSection component
 */
const ErrorSection: FC<Props> = ({ message, details, useBorders, handleRetry }) => (
  <div className={styles.error} style={!useBorders ? { border: 'none' } : {}}>
    <img src={errorBg} alt="document" height={194} className={styles.bg} />
    <UilExclamationCircle size="4em" style={{ color: 'var(--color-danger-700)' }} />
    <h3>¡Se presentó un error técnico!</h3>
    <p>
      En este momento no es posible realizar la consulta por un error técnico. Por favor, inténtalo
      más tarde. Se presentó el siguiente error: <br />
    </p>
    {details ? (
      <details className="code">
        <summary>
          <strong>{message}</strong>
        </summary>
        <code>{details}</code>{' '}
      </details>
    ) : (
      <strong>{message}</strong>
    )}
    <div className={styles.actions}>
      <Button onClick={handleRetry}>Reintentar</Button>
    </div>
  </div>
);

export default ErrorSection;
