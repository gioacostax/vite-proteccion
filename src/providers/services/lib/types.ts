/**
 * Project vite (base-services)
 */

import type { Options } from 'pusher-js';

import type { RawPayload } from './commandService';

export interface ServiceErrorFormat<Details = unknown> {
  readonly type:
    | 'auth'
    | 'fetch'
    | 'cors'
    | 'parse-json'
    | 'service'
    | 'graphql'
    | 'gql-request'
    | 'pusher'
    | 'command';
  readonly code: string | number | null;
  readonly message: string;
  readonly details?: Details;
}

export type ServiceParams = object | string | URLSearchParams | string[][] | undefined;
export type ServiceBody = object | BodyInit | undefined;
export type ServicePayload = object | undefined;
export type ServiceVariables = object | undefined;
export type ServiceResponse = object | boolean | number | string | undefined;

////// Base Preset //////
export type FetchPreset<
  Params extends ServiceParams,
  Body extends ServiceBody,
  Response extends ServiceResponse,
  Data = Response,
  Error = Response,
> = {
  readonly queryKey: readonly unknown[];

  readonly method: string;
  readonly url: string;

  readonly headers?: HeadersInit;
  readonly params?: Params;
  readonly body?: Body;

  readonly parseData: (response: Response) => Data;
  readonly isError?: (response: Error) => boolean;
  readonly usePayloadHook?: () => () => Promise<unknown>;
};

////// GraphQL Preset //////
export type GraphQLPreset<
  Variables extends ServiceVariables,
  R extends ServiceResponse,
  D = Response,
  E = Response,
> = Omit<FetchPreset<never, never, R, D, E>, 'method' | 'params' | 'body'> & {
  readonly query: string;
  readonly variables?: Variables;
};

////// Command Preset //////
export type CommandPreset<
  Payload extends ServicePayload,
  R extends ServiceResponse,
  D = Response,
  E = Response,
> = Omit<FetchPreset<never, never, R, D, RawPayload<E>>, 'method' | 'params' | 'body'> & {
  readonly payload?: Payload;
  readonly name: string;
  readonly token: string;
  readonly subject: string;
  readonly pusherOptions: Options & { appKey: string };
  readonly transactionId?: string;
  readonly timeout?: number;
  readonly id?: string;
  readonly traceId?: string;
  readonly appId: string;
  readonly appName: string;
  readonly ip: string;
};
