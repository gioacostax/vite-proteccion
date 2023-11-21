/**
 * Project vite (base-main)
 */

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import AuthProvider from './providers/auth';
import PagesProvider from './providers/pages';
import ServicesProvider from './providers/services';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ServicesProvider>
        <PagesProvider />
      </ServicesProvider>
    </AuthProvider>
  </StrictMode>,
);
