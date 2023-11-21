/**
 * Project vite (base-components)
 */

import { CSSProperties, FC, PropsWithChildren, ReactNode, useRef } from 'react';

import {
  UilCheckCircle,
  UilExclamationCircle,
  UilExclamationTriangle,
  UilInfoCircle,
  UilMultiply,
} from '@iconscout/react-unicons';

import Button from '@/components/ui/button';
import Screen from '@/components/ui/screen';
import Shimmer from '@/components/ui/shimmer';

import styles from './styles.module.scss';

interface Props {
  style?: CSSProperties;
  className?: string;
  modalStyle?: CSSProperties;

  /* Modal properties */
  icon?: 'success' | 'danger' | 'warning' | 'info';
  title?: ReactNode;
  actions?: ReactNode;
  isClosable?: boolean;
  isLoading?: boolean;

  /* Screen properties */
  isVisible?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
}

/**
 * Modal component
 */
const Modal: FC<PropsWithChildren<Props>> = ({
  title,
  icon,
  actions,
  isClosable,
  style,
  className,
  modalStyle,
  children,
  isLoading,
  ...rest
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <Screen childRef={modalRef} className={styles.screen} {...rest}>
      <div className={styles.modal} style={modalStyle} role="dialog" data-theme>
        {title && (
          <div className={styles.header}>
            {icon === 'info' && (
              <UilInfoCircle
                size={32}
                style={{ color: 'var(--color-info-700)' }}
                data-testid="info-icon"
              />
            )}
            {icon === 'success' && (
              <UilCheckCircle
                size={32}
                style={{ color: 'var(--color-success-700)' }}
                data-testid="success-icon"
              />
            )}
            {icon === 'warning' && (
              <UilExclamationTriangle
                size={32}
                style={{ color: 'var(--color-warning-700)' }}
                data-testid="warning-icon"
              />
            )}
            {icon === 'danger' && (
              <UilExclamationCircle
                size={32}
                style={{ color: 'var(--color-danger-700)' }}
                data-testid="danger-icon"
              />
            )}
            <h2>{title}</h2>
            {isClosable && (
              <Button
                size="sm"
                style={{ padding: 0, marginLeft: 'auto' }}
                variant="ghost"
                onClick={rest.onClose}
                data-testid="modal-close-icon"
              >
                <UilMultiply />
              </Button>
            )}
          </div>
        )}
        <div style={style} className={[styles.body, className].filter(Boolean).join(' ')}>
          {isLoading ? (
            <>
              <Shimmer data-testid="shimmer" />
              <Shimmer />
              <Shimmer />
            </>
          ) : (
            children
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </Screen>
  );
};

export default Modal;
