/**
 * Project project-name
 */

import { UilUserTimes } from '@iconscout/react-unicons';

import styles from './styles.module.scss';

/**
 * NoRole component
 */
const NoRole = () => {
  return (
    <div className={styles.norole}>
      <UilUserTimes size="4em" color="var(--color-primary-500)" />
      <p>
        No tienes permiso para ingresar a este modulo, contacta al administrador del aplicativo.
      </p>
    </div>
  );
};

export default NoRole;
