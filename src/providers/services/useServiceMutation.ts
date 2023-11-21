/**
 * Project vite (base-services)
 */

import { useMutation, UseMutationResult, type UseMutationOptions } from '@tanstack/react-query';

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

const useServiceMutation = <
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
  options?: Omit<
    UseMutationOptions<D extends R ? R : D, ServiceError, FnPayload<Pa, V, P, B, R, D, E>>,
    'onSuccess' | 'onSettled'
  > & {
    onSuccess?: (
      data: D extends R ? R : D,
      variables: FnPayload<Pa, V, P, B, R, D, E>,
      context: unknown,
    ) => unknown;
    onSettled?: (
      data: D extends R ? R : D | undefined,
      error: ServiceError | null,
      variables: FnPayload<Pa, V, P, B, R, D, E>,
      context: unknown,
    ) => unknown;
  },
) => {
  // Add aditionals hooks here...
  const hookData = setup.usePayloadHook?.();

  const mutation = useMutation<D extends R ? R : D, ServiceError, FnPayload<Pa, V, P, B, R, D, E>>({
    ...options,
    mutationKey: setup.queryKey.concat(options?.mutationKey).filter(Boolean),
    mutationFn: async (fnPayload) =>
      setup.fetch({
        ...(fnPayload as typeof setup extends FetchServicePreset<P, B, R, D, E>
          ? FetchServicePayload<P, B, R, D, E>
          : typeof setup extends GraphQLServicePreset<V, R, D, E>
            ? GraphQLServicePayload<V, R, D, E>
            : CommandServicePayload<Pa, R, D, E>),
        ...(await hookData?.()),
      }) as Promise<D extends R ? R : D>,
    onSuccess: (data, fnPayload, context) =>
      options?.onSuccess?.(
        (setup.parseData?.(data as R) ?? data) as D extends R ? R : D,
        fnPayload,
        context,
      ),
    onSettled: (data, error, fnPayload, context) =>
      options?.onSettled?.(
        (setup.parseData?.(data as R) ?? data) as D extends R ? R : D,
        error,
        fnPayload,
        context,
      ),
  });

  return {
    ...mutation,
    data: (mutation.data && setup.parseData
      ? setup.parseData(mutation.data as R)
      : mutation.data) as D extends R ? R : D,
    mutateAsync: (fnPayload, options) =>
      new Promise((resolve, rejects: Reject<ServiceError>) => {
        mutation
          .mutateAsync(fnPayload, options)
          .then((data) => {
            resolve((setup.parseData ? setup.parseData(data as R) : data) as D extends R ? R : D);
          })
          .catch((err: ServiceError) => {
            rejects(err);
          });
      }),
  } as UseMutationResult<D extends R ? R : D, ServiceError, FnPayload<Pa, V, P, B, R, D, E>>;
};

export default useServiceMutation;
