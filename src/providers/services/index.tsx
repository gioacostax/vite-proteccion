/**
 * Project vite (base-services)
 */

import type { FC, PropsWithChildren } from 'react';

import { QueryClientProvider, QueryClient, type QueryClientConfig } from '@tanstack/react-query';

export { FetchServicePreset } from './lib/fetchService';
export { GraphQLServicePreset } from './lib/graphQLService';
export { CommandServicePreset } from './lib/commandService';
export { default as ServiceError } from './lib/serviceError';
export { default as useServiceMutation } from './useServiceMutation';
export { default as useServiceQuery } from './useServiceQuery';

///////////////////// React Query Services /////////////////////
const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retryOnMount: true,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
};

const ServicesProvider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={new QueryClient(QUERY_CONFIG)}>{children}</QueryClientProvider>
);
////////////////////////////////////////////////////////////////

export default ServicesProvider;
