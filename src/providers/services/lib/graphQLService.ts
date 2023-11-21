/**
 * Project vite (base-services)
 */

import type { GraphQLError } from 'graphql';
import { rawRequest, type Variables } from 'graphql-request';

import ServiceError from './serviceError';
import type { GraphQLPreset, ServiceResponse, ServiceVariables } from './types';

export interface RealmGraphQLError<V extends ServiceVariables> {
  request: {
    query: string;
    variables: V;
  };
  response: {
    data?: null;
    error?: string;
    headers: { map: Record<string, string> };
    link?: string;
    errors?: GraphQLError[];
    status: number;
  };
}

interface GraphQLServicePresetParams<V extends ServiceVariables, R extends ServiceResponse, E = R> {
  readonly url: string;
  readonly query: string;
  readonly headers?: HeadersInit;
  readonly variables?: V;
  readonly isError?: (response: E) => boolean;
}

export type GraphQLServicePayload<
  V extends ServiceVariables,
  R extends ServiceResponse,
  D = R,
  E = R,
> = Pick<GraphQLPreset<V, R, D, E>, 'headers' | 'variables'>;

const graphqlService = <V extends ServiceVariables, R extends ServiceResponse, E = R>({
  url,
  query,
  variables,
  headers,
  isError,
}: GraphQLServicePresetParams<V, R, E>) =>
  new Promise<R>((resolve, reject: Reject<ServiceError>) => {
    rawRequest<R | E>(url, query, variables as Variables, headers)
      .then(({ data, status, errors }) => {
        if (errors)
          reject(
            new ServiceError({
              type: 'graphql',
              code: status,
              message: errors[0].message,
              details: errors,
            }),
          );

        if (isError?.(data as E))
          reject(
            new ServiceError({
              type: 'service',
              code: null,
              message: 'Service error',
              details: data as E,
            }),
          );

        resolve(data as R);
      })
      .catch((err: RealmGraphQLError<V>) => {
        reject(
          new ServiceError({
            type: 'gql-request',
            code: err.response.status,
            message: err.response.error ?? err.response.errors?.[0].message ?? 'GraphQL error',
            details: err,
          }),
        );
      });
  });

export class GraphQLServicePreset<
  V extends ServiceVariables,
  R extends ServiceResponse,
  D = R,
  E = R,
> {
  queryKey: GraphQLPreset<V, R, D, E>['queryKey'];
  usePayloadHook?: () => () => Promise<GraphQLServicePayload<V, R, D, E>>;
  #url: GraphQLPreset<V, R, D, E>['url'];
  #query: GraphQLPreset<V, R, D, E>['query'];
  #payload?: GraphQLServicePayload<V, R, D, E>;
  parseData?: GraphQLPreset<V, R, D, E>['parseData'];
  #isError?: GraphQLPreset<V, R, D, E>['isError'];

  constructor(
    params: D extends R ? Omit<GraphQLPreset<V, R, D, E>, 'parseData'> : GraphQLPreset<V, R, D, E>,
  ) {
    this.queryKey = params.queryKey;
    this.usePayloadHook = params.usePayloadHook as () => () => Promise<
      GraphQLServicePayload<V, R, D, E>
    >;
    this.#url = params.url;
    this.#query = params.query;
    this.#payload = {
      headers: params.headers,
      variables: params.variables,
    };
    this.parseData = (params as GraphQLPreset<V, R, D, E> | undefined)?.parseData;
    this.#isError = params.isError;
  }

  async fetch(options?: GraphQLServicePayload<V, R, D, E>) {
    return graphqlService<V, R, E>({
      url: this.#url,
      query: this.#query,
      variables: this.#payload?.variables ?? options?.variables,
      headers: {
        ...this.#payload?.headers,
        ...options?.headers,
      },
      isError: this.#isError,
    });
  }
}

export default graphqlService;
