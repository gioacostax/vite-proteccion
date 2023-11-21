/**
 * Project project-name
 */

import type { FC } from 'react';

import logo from '@/assets/images/logo.svg';

import styles from './styles.module.scss';

interface Props {
  title: string;
}

/**
 * Header component
 */
const Header: FC<Props> = ({ title }) => (
  <header>
    <img src={logo} alt="Protección" className={styles.logo} />
    <span className={styles.title}>{title}</span>
  </header>
);

export default Header;
