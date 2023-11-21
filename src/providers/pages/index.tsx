/**
 * Project vite (base-routing)
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoaderModal from '@/components/loaderModal';
import PAGES from '@/pages';

const PagesProvider = () => (
  <RouterProvider router={createBrowserRouter(PAGES)} fallbackElement={<LoaderModal isVisible />} />
);

export default PagesProvider;
