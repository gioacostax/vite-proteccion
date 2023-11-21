/**
 * Project project-name
 */

import { useEffect, useState } from 'react';

import Button from '@/components/ui/button';
import env from '@/env';
import { useAuth } from '@/providers/auth';

import styles from './styles.module.scss';

/**
 * Session component
 */
const Session = () => {
  const { getToken } = useAuth();
  const [date, setDate] = useState('-');

  useEffect(() => {
    setDate(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    const timer = setInterval(() => {
      setDate(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <ul className={styles.session}>
      <li>
        {env.APP_ALIAS}:{env.APP_MODE}
      </li>
      <li>
        <strong>Fecha actual: </strong>
        {date}
      </li>
      <li>
        <Button
          variant="text"
          theme="secondary"
          onClick={
            (async () => {
              await navigator.clipboard.writeText((await getToken()).idToken);
            }) as Fn
          }
        >
          TOKEN
        </Button>
      </li>
    </ul>
  );
};

export default Session;
