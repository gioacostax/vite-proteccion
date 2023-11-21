/**
 * Project vite (base-services)
 */

import Pusher, { type Channel, type Options } from 'pusher-js';
import { v4 as uuid } from 'uuid';

import fetchService from './fetchService';
import ServiceError from './serviceError';
import type { ServiceBody, ServicePayload, CommandPreset, ServiceResponse } from './types';

export type CommandServicePayload<
  P extends ServicePayload,
  R extends ServiceResponse,
  D = R,
  E = R,
> = Pick<
  CommandPreset<P, R, D, E>,
  'payload' | 'headers' | 'id' | 'token' | 'subject' | 'traceId' | 'transactionId' | 'ip'
>;

interface SubscriptionError {
  type: string;
  error: string;
  status: number;
}

interface ServiceHeader {
  responseCode: string;
  errorType: string;
  detail: string | null;
}

export interface RawPayload<Response = null> {
  readonly header: ServiceHeader;
  readonly payload: Response | null;
}

interface CommandResponse<Response = null> {
  id: string;
  idTrazabilidad: string;
  nombre: string;
  version: string;
  aplicacionEmisora: {
    idAplicacionEmisora: string;
    nombreAplicacionEmisora: string;
    idTransaccionEmisora: string;
    fechaTransaccion: string;
  };
  usuario: {
    dni: string;
    ip: string;
    nombre: string;
    canal: string;
    telefono: string;
    idSession: string;
  };
  dni: {
    tipoIdentificacion: string;
    identificacion: string;
  };
  timestamp: number;
  payload: RawPayload<Response>;
  idComando: string;
  resultado: string;
  eventScope: string;
}

interface EventResponse<Response = null> {
  id: string;
  idSession: string;
  fragments: number;
  fragmentOffset: number;
  data: CommandResponse<Response>;
  channel: string;
}

interface CommandServicePresetParams<P extends ServiceBody, R extends ServiceResponse, E = R> {
  readonly url: string;
  readonly headers?: HeadersInit;
  readonly payload?: P;
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
  readonly isError?: (response: RawPayload<E>) => boolean;
}

const commandService = async <P extends ServicePayload, R extends ServiceResponse, E = R>({
  url,
  headers,
  payload,
  name,
  token,
  subject,
  transactionId = uuid(),
  id = uuid(),
  traceId = uuid(),
  appId,
  appName,
  ip,
  timeout = 10000,
  pusherOptions,
  isError,
}: CommandServicePresetParams<P, R, E>) => {
  let pusher: Pusher;
  const subscribe = () =>
    new Promise<{ pusher: Pusher; channel: Channel }>((resolve, reject: Reject<ServiceError>) => {
      pusher = new Pusher(pusherOptions.appKey, {
        ...pusherOptions,
        auth: { ...pusherOptions.auth, params: { token, senderKey: pusherOptions.appKey } },
      });

      const channel = pusher.subscribe(`private-${subject}`);
      channel.bind('pusher:subscription_succeeded', () => {
        resolve({ pusher, channel });
      });
      channel.bind('pusher:subscription_error', (err: SubscriptionError) => {
        pusher.disconnect();
        reject(
          new ServiceError({
            type: 'pusher',
            code: err.status,
            message: err.error,
            details: err,
          }),
        );
      });
    });

  const listenTransaction = <R>(channel: Channel) =>
    new Promise<R>((resolve, reject: Reject<ServiceError>) => {
      const fragsBuffer: string[] = [];

      // Validamos la integridad del comando
      const parseData = (data: CommandResponse<R | E>) => {
        const throwError = () => {
          channel.unbind('ui.event', event);
          pusher.disconnect();
          reject(
            new ServiceError({
              type: 'command',
              code: data.payload.header.responseCode,
              message: data.payload.header.detail ?? 'Desconocido',
              details: data.payload,
            }),
          );
        };

        // Imporante para no operar sobre transacciones no reconocidas
        if (data.aplicacionEmisora.idTransaccionEmisora !== transactionId) return;

        switch (true) {
          case data.nombre.split('.').at(-1) === 'failed':
            throwError();
            break;
          case data.resultado === 'FAILED':
            throwError();
            break;
          case isError?.(data.payload as RawPayload<E>):
            throwError();
            break;
          default:
            channel.unbind('ui.event', event);
            pusher.disconnect();
            resolve(data.payload.payload as R); // Without format
        }
      };

      // Validamos si el evento es fragmentado
      const event = ({ fragments, fragmentOffset, data }: EventResponse<R>) => {
        if (fragments > 1) {
          fragsBuffer[fragmentOffset] = data as unknown as string;

          if (fragsBuffer.flat().length === fragments)
            parseData(JSON.parse(fragsBuffer.join('')) as CommandResponse<R>);
        } else parseData(data);
      };

      channel.bind('ui.event', event);
      setTimeout(() => {
        channel.unbind('ui.event', event);
        reject(
          new ServiceError({
            type: 'command',
            code: null,
            message: 'Se ha vencido el tiempo limite de respuesta.',
          }),
        );
      }, timeout);
    });

  const subscription = await subscribe();
  await fetchService({
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      canal: 'INTERNET',
      Accept: ' application/json',
      ...headers,
    },
    method: 'POST',
    body: {
      comando: {
        id,
        idTrazabilidad: traceId,
        nombre: name,
        version: '1.0',
        aplicacionEmisora: {
          idAplicacionEmisora: appId,
          nombreAplicacionEmisora: appName,
          idTransaccionEmisora: transactionId,
          fechaTransaccion: new Date().toISOString().split('.')[0],
        },
        usuario: {
          ip,
          idSession: subscription.channel.name,
          canal: 'INTERNET',
        },
        timestamp: new Date().getTime(),
        payload,
      },
    },
  });
  return await listenTransaction<R>(subscription.channel);
};

export class CommandServicePreset<
  P extends ServicePayload,
  R extends ServiceResponse,
  D = R,
  E = R,
> {
  queryKey: CommandPreset<P, R, D, E>['queryKey'];
  usePayloadHook?: () => () => Promise<CommandServicePayload<P, R, D, E>>;
  #url: CommandPreset<P, R, D, E>['url'];
  #name: CommandPreset<P, R, D, E>['name'];
  #pusherOptions: CommandPreset<P, R, D, E>['pusherOptions'];
  #appId: CommandPreset<P, R, D, E>['appId'];
  #appName: CommandPreset<P, R, D, E>['appName'];
  parseData?: CommandPreset<P, R, D, E>['parseData'];
  #isError?: (response: RawPayload<E>) => boolean;

  constructor(
    params: D extends R
      ? Omit<CommandPreset<P, R, D, E>, 'token' | 'subject' | 'ip' | 'parseData'>
      : Omit<CommandPreset<P, R, D, E>, 'token' | 'subject' | 'ip'>,
  ) {
    this.queryKey = params.queryKey;
    this.usePayloadHook = params.usePayloadHook as () => () => Promise<
      CommandServicePayload<P, R, D, E>
    >;
    this.#url = params.url;
    this.#name = params.name;
    this.#pusherOptions = params.pusherOptions;
    this.#appId = params.appId;
    this.#appName = params.appName;
    this.parseData = (params as CommandPreset<P, R, D, E> | undefined)?.parseData;
    this.#isError = params.isError;
  }

  async fetch(options: CommandServicePayload<P, R, D, E>) {
    return commandService<P, R, E>({
      ...options,
      url: this.#url,
      name: this.#name,
      appId: this.#appId,
      appName: this.#appName,
      pusherOptions: this.#pusherOptions,
      isError: this.#isError,
    });
  }
}

export default commandService;
