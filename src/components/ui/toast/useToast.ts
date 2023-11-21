/**
 * Project vite (base-components)
 */

import { useCallback } from 'react';

import styles from './styles.module.scss';

/**
 * Create a toast element
 */
const useToast = (parentId = 'root') => {
  const addToast = useCallback(
    (type: 'info' | 'success' | 'warn' | 'danger', content: string) => {
      const parent = document.getElementById(parentId);
      let container = document.getElementById('toast-container');

      if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'toast-container');
        container.setAttribute('class', styles.container);
        parent?.appendChild(container);
      }

      const icon = document.createElement('span');
      icon.setAttribute('class', styles.icon);

      const body = document.createElement('p');
      body.appendChild(document.createTextNode(content));

      const toast = document.createElement('div');
      toast.setAttribute('data-theme', '');
      toast.setAttribute('data-type', type);
      toast.setAttribute('class', styles.toast);

      toast.appendChild(icon);
      toast.appendChild(body);
      container.appendChild(toast);

      setTimeout(() => container?.removeChild(toast), 5000);
    },
    [parentId],
  );

  return { addToast };
};

export default useToast;
