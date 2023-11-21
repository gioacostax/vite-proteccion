/**
 * Project project-name
 */

import { useCallback, useMemo } from 'react';

import { createPortal } from 'react-dom';

import { Outlet, matchRoutes, useLocation } from 'react-router-dom';

import NoRole from '@/containers/noRole';
import PAGES from '@/pages';
import { useAuth } from '@/providers/auth';
import matchRole from '@/utils/matchRole';

import Header from './header';
import Session from './session';
import Sidebar from './sidebar';
import './styles.scss';

/**
 * DisabilitiesLayout component
 */
const DisabilitiesLayout = () => {
  const { roles } = useAuth();
  const location = useLocation();

  const findLastRouteRole = useCallback(
    () =>
      matchRoutes(PAGES, location.pathname)
        ?.slice()
        ?.reverse() // equivalent findLast (node v18)
        .find((match) => match.route.roles)?.route.roles,
    [location.pathname],
  );

  const renderPage = useMemo(
    () => (matchRole(findLastRouteRole(), roles) ? <Outlet /> : <NoRole />),
    [findLastRouteRole, roles],
  );

  return createPortal(
    <>
      <Header title="Project" />
      <Sidebar pages={PAGES[0].children!} userRoles={roles} />
      {renderPage}
      <footer>
        <Session />
      </footer>
    </>,
    document.getElementById('root')!,
  );
};

export default DisabilitiesLayout;
