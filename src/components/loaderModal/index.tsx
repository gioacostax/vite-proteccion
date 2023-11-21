/**
 * Project vite (base-components)
 */

import type { FC } from 'react';

import Modal from '../modal';
import Spinner from '../ui/spinner';

import styles from './styles.module.scss';

interface Props {
  isVisible: boolean;
}

/**
 * LoaderModal component
 */
const LoaderModal: FC<Props> = ({ isVisible }) => (
  <Modal isVisible={isVisible} className={styles.modal}>
    <h3>¡Estamos cargando la mejor experiencia para ti!</h3>
    <Spinner />
    <p>Que tus decisiones de hoy te lleven a cumplir metas.</p>
  </Modal>
);

export default LoaderModal;
