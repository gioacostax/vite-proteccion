/**
 * Project vite (base-services)
 */

import ServiceError from './serviceError';
import type { ServiceBody, ServiceParams, FetchPreset, ServiceResponse } from './types';

interface FetchServicePresetParams<
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  E = R,
> {
  readonly url: string;
  readonly method: string;
  readonly headers?: HeadersInit;
  readonly params?: P;
  readonly body?: B;
  readonly isError?: (response: E) => boolean;
}

export type FetchServicePayload<
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  D = R,
  E = R,
> = Pick<FetchPreset<P, B, R, D, E>, 'headers' | 'params' | 'body'> & {
  path?: string;
};

const fetchService = <
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  E = R,
>({
  url,
  method,
  headers,
  params,
  body,
  isError,
}: FetchServicePresetParams<P, B, R, E>) =>
  new Promise<R>((resolve, reject: Reject<ServiceError>) => {
    // Delete empty strings values from params
    const _params = new URLSearchParams(params as URLSearchParams);
    const cleanedParams = new URLSearchParams(params as URLSearchParams);
    _params.forEach((value, key) => {
      value === '' && cleanedParams.delete(key);
    });

    fetch(`${url}?${cleanedParams.toString()}`, {
      method,
      headers: {
        ...(typeof body === 'object' && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: typeof body === 'object' ? JSON.stringify(body) : body,
    })
      .then((response) => {
        if (!response.ok)
          // Test .json() to know if the response has additional info
          response
            .json()
            .then((data: E) => {
              reject(
                new ServiceError({
                  type: 'service',
                  code: response.status,
                  message: response.statusText,
                  details: data,
                }),
              );
            })
            .catch((err: Error) => {
              reject(
                new ServiceError({
                  type: 'cors',
                  code: response.status,
                  message: response.statusText,
                  details: err,
                }),
              );
            });
        else if (response.headers.get('content-type')?.match(/application\/json/)) {
          response
            .json()
            .then((data: R | E) => {
              if (isError?.(data as E)) {
                reject(
                  new ServiceError({
                    type: 'service',
                    code: null,
                    message: 'Service error',
                    details: data as E,
                  }),
                );
              }

              resolve(data as R);
            })
            .catch((err: Error) => {
              reject(
                new ServiceError({
                  type: 'parse-json',
                  code: null,
                  message: `${err.name}: ${err.message}`,
                  details: err,
                }),
              );
            });
        } else {
          resolve(undefined as R);
        }
      })
      .catch((err: Error) => {
        reject(
          new ServiceError({
            type: 'fetch',
            code: null,
            message: `${err.name}: ${err.message}`,
            details: JSON.stringify(err),
          }),
        );
      });
  });

export class FetchServicePreset<
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  D = R,
  E = R,
> {
  queryKey: FetchPreset<P, B, R, D, E>['queryKey'];
  usePayloadHook?: () => () => Promise<FetchServicePayload<P, B, R, D, E>>;
  #method: FetchPreset<P, B, R, D, E>['method'];
  #url: FetchPreset<P, B, R, D, E>['url'];
  #payload?: FetchServicePayload<P, B, R, D, E>;
  parseData?: FetchPreset<P, B, R, D, E>['parseData'];
  #isError?: FetchPreset<P, B, R, D, E>['isError'];

  constructor(
    params: D extends R
      ? Omit<FetchPreset<P, B, R, D, E>, 'parseData'>
      : FetchPreset<P, B, R, D, E>,
  ) {
    this.queryKey = params.queryKey;
    this.usePayloadHook = params.usePayloadHook as () => () => Promise<
      FetchServicePayload<P, B, R, D, E>
    >;
    this.#method = params.method;
    this.#url = params.url;
    this.#payload = {
      headers: params.headers,
      params: params.params,
      body: params.body,
    };
    this.parseData = (params as FetchPreset<P, B, R, D, E> | undefined)?.parseData;
    this.#isError = params.isError;
  }

  async fetch(options?: FetchServicePayload<P, B, R, D, E>) {
    return fetchService<P, B, R, E>({
      url: `${this.#url}${options?.path ?? ''}`,
      method: this.#method,
      headers: {
        ...this.#payload?.headers,
        ...options?.headers,
      },
      params: this.#payload?.params ?? options?.params,
      body: this.#payload?.body ?? options?.body,
      isError: this.#isError,
    });
  }
}

export default fetchService;
