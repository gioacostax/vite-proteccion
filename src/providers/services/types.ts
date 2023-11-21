/**
 * Project vite (base-services)
 */

import type { CommandServicePayload } from './lib/commandService';
import type { FetchServicePayload } from './lib/fetchService';
import type { GraphQLServicePayload } from './lib/graphQLService';
import type {
  ServiceBody,
  ServiceParams,
  ServicePayload,
  ServiceResponse,
  ServiceVariables,
} from './lib/types';

export type FnPayload<
  Pa extends ServicePayload,
  V extends ServiceVariables,
  P extends ServiceParams,
  B extends ServiceBody,
  R extends ServiceResponse,
  D = R,
  E = R,
> =
  | FetchServicePayload<P, B, R, D, E>
  | GraphQLServicePayload<V, R, D, E>
  | CommandServicePayload<Pa, R, D, E>;
