/**
 * Project project-name
 */

import { FC, useState } from 'react';

import { NavLink } from 'react-router-dom';

import Float from '@/components/ui/float';
import useWindowSize from '@/hooks/useWindowSize';
import type { Route } from '@/pages';
import matchRole from '@/utils/matchRole';

import styles from './styles.module.scss';

interface Props {
  pages: Route[];
  userRoles?: string[];
}

/**
 * Sidebar component
 */
const Sidebar: FC<Props> = ({ pages, userRoles }) => {
  const [floatVisibility, setFloatVisibility] = useState<Record<string, boolean>>({});
  const { width } = useWindowSize();

  const indexPage = pages.find(({ index }) => index);

  return (
    <nav className={styles.sidebar}>
      {indexPage && (
        <NavLink
          to={indexPage.path!}
          className={[styles.link, indexPage.path === location.pathname && styles.active]
            .filter(Boolean)
            .join(' ')}
        >
          {indexPage.icon}
          <span className={styles.label}>{indexPage.title}</span>
        </NavLink>
      )}
      {pages.map(
        (route) =>
          route.path !== '*' &&
          !route.index &&
          !route.hidden &&
          matchRole(route.roles, userRoles) && (
            <div key={route.id}>
              <NavLink
                id={route.id}
                to={route.path!}
                className={({ isActive }) =>
                  [styles.link, isActive && styles.active].filter(Boolean).join(' ')
                }
              >
                {route.icon}
                <span className={styles.label}>{route.title}</span>
              </NavLink>
              {route.children?.length && (
                <Float
                  targetId={route.id}
                  mode="click"
                  position={width > 768 ? 'right-start' : 'top-start'}
                  isVisible={!!floatVisibility[route.id]}
                  onChange={(value) => {
                    setFloatVisibility((prev) => ({ ...prev, [route.id]: value }));
                  }}
                >
                  <div className={styles.menu}>
                    <h4 className={styles.title}>{route.title}</h4>
                    <ul>
                      {route.children.map((subRoute) => (
                        <li key={subRoute.id}>
                          <NavLink
                            key={subRoute.id}
                            to={subRoute.path ?? route.path!}
                            onClick={() => {
                              setFloatVisibility((prev) => ({ ...prev, [route.id]: false }));
                            }}
                            className={({ isActive }) =>
                              [styles.sublink, isActive && styles.active].filter(Boolean).join(' ')
                            }
                          >
                            {subRoute.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Float>
              )}
            </div>
          ),
      )}
    </nav>
  );
};

export default Sidebar;
