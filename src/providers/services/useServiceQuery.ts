/**
 * Project vite (base-services)
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { CommandServicePreset, CommandServicePayload } from './lib/commandService';
import type { FetchServicePreset, FetchServicePayload } from './lib/fetchService';
import type { GraphQLServicePreset, GraphQLServicePayload } from './lib/graphQLService';
import type ServiceError from './lib/serviceError';
import type {
  ServiceResponse,
  ServiceBody,
  ServiceParams,
  ServiceVariables,
  ServicePayload,
} from './lib/types';
import type { FnPayload } from './types';

const useServiceQuery = <
  Pa extends ServicePayload,
  V extends ServiceVariables,
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  D = R,
  E = R,
>(
  setup:
    | FetchServicePreset<P, B, R, D, E>
    | GraphQLServicePreset<V, R, D, E>
    | CommandServicePreset<Pa, R, D, E>,
  options?: Partial<UseQueryOptions<R, ServiceError, D>> & {
    fnPayload?: FnPayload<Pa, V, P, B, R, D, E>;
  },
) => {
  // Add aditionals hooks here...
  const hookData = setup.usePayloadHook?.();

  return useQuery<R, ServiceError, D>({
    ...options,
    queryKey: setup.queryKey.concat(options?.queryKey).filter(Boolean),
    queryFn: async () =>
      setup.fetch({
        ...(options?.fnPayload as typeof setup extends FetchServicePreset<P, B, R, D, E>
          ? FetchServicePayload<P, B, R, D, E>
          : typeof setup extends GraphQLServicePreset<V, R, D, E>
            ? GraphQLServicePayload<V, R, D, E>
            : CommandServicePayload<Pa, R, D, E>),
        ...(await hookData?.()),
      }),
    select: setup.parseData,
  });
};

export default useServiceQuery;
