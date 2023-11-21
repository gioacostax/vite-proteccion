/**
 * Project project-name
 */

import type { ReactNode } from 'react';

import { UilHome } from '@iconscout/react-unicons';
import type { RouteObject } from 'react-router-dom';

export type Route = {
  id: string;
  title?: string;
  icon?: ReactNode;
  children?: Route[];
  roles?: string[];
  hidden?: boolean;
} & RouteObject;

/*
 * Cada una de las paginas/modulos de la aplicación se carga asincronamente, esto permite
 * dividir el codigo en partes y solo aquellas que han cambiado se invalidan de la cache del navegador,
 * sin embargo esta implementación no contiene un fallback (loader) que le indique al usuario
 * que se esta cargando un modulo en el navegador y puede generar confusión si el internet es lento.
 */
const PAGES: Route[] = [
  {
    id: 'layout',
    path: '/',
    lazy: async () => ({ Component: (await import('../layouts')).default }),
    children: [
      {
        id: 'home',
        path: '/',
        lazy: async () => ({ Component: (await import('./home')).default }),
        title: 'Inicio',
        icon: <UilHome />,
        index: true,
      },
      {
        id: 'private',
        path: '/private',
        lazy: async () => ({ Component: (await import('./home')).default }),
        title: 'Privado',
        icon: <UilHome />,
        roles: ['Aprobaciones_Incapacidades_PRU'],
      },
      {
        id: '404',
        lazy: async () => ({ Component: (await import('./404')).default }),
        path: '*',
      },
    ] as Route[],
  },
];

export default PAGES;
