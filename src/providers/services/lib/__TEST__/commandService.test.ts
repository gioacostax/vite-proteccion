/**
 * Project vite (base-services)
 */

import type { Options } from 'pusher-js';
import type { Mock } from 'vitest';

import commandService, { CommandServicePreset } from '../commandService';

///////////////////// fetch Mocking /////////////////////
const fetchMock = (result?: Partial<Response>, isError?: boolean, error?: Error) => {
  const mock = vi.fn();

  if (isError && error) {
    mock.mockRejectedValue(error);
  } else if (isError) {
    mock.mockResolvedValue({
      url: '/error',
      ok: false,
      status: 500,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.reject(new Error('JSON error')),
      ...result,
    } as Response);
  } else {
    mock.mockResolvedValue({
      url: '/success',
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({}),
      status: 200,
      ...result,
    } as Response);
  }

  global.fetch = mock;
  return mock;
};

const EVENT_MOCK = {
  fragments: 1,
  fragmentOffset: 0,
  data: {
    nombre: 'command.success',
    aplicacionEmisora: {
      idTransaccionEmisora: 'transactionId',
    },
    payload: {
      header: {
        responseCode: 'M0000',
        errorType: '0',
        detail: null,
      },
      payload: { data: true },
    },
  },
};

///////////////////// Pusher Mocking /////////////////////
vi.mock('pusher-js', () => ({
  default: class {
    #bind = vi.fn().mockImplementation((event: string, callback: (data?: object) => void) => {
      switch (event) {
        case 'pusher:subscription_succeeded':
          callback();
          break;
        case 'ui.event':
          callback(EVENT_MOCK);
          break;
        default:
          break;
      }
    });

    /*
     * Aprovechamos la propiedad options.auth.headers para mockeadr bind
     */
    constructor(_: string, options: Options) {
      this.#bind = (options.auth?.headers as { bind?: Mock } | undefined)?.bind ?? this.#bind;
    }

    subscribe() {
      return {
        unbind: vi.fn(),
        bind: this.#bind,
      };
    }

    disconnect = vi.fn();
  },
}));

const FN_PARAMS_MOCK = {
  url: '/api',
  name: 'command',
  token: 'token',
  subject: 'subject',
  ip: '0.0.0.0',
  pusherOptions: {
    appKey: 'appKey',
    cluster: 'cluster',
  },
  appId: 'appId',
  appName: 'appName',
  transactionId: 'transactionId',
};

describe('fn: commandService', () => {
  beforeEach(() => {
    fetchMock();
  });

  test('execute: success', async () => {
    /* Assertions */
    await expect(commandService(FN_PARAMS_MOCK)).resolves.toEqual(EVENT_MOCK.data.payload.payload);
  });

  test('execute: success (event fragmented)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 3,
                        fragmentOffset: 0,
                        data: '{"nombre": "command.success","aplicacionEmisora":{"idTransaccionEmisora":"transac',
                      });
                      callback({
                        fragments: 3,
                        fragmentOffset: 2,
                        data: 'rrorType":"0","detail":null},"payload":"fragmented_data"}}',
                      });
                      callback({
                        fragments: 3,
                        fragmentOffset: 1,
                        data: 'tionId"},"payload":{"header":{"responseCode":"M0000","e',
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).resolves.toEqual('fragmented_data');
  });

  test('execute: timeout', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Se ha vencido el tiempo limite de respuesta.');
  });

  test('execute: timeout (diff idTransaction)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        transactionId: undefined,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 1,
                        fragmentOffset: 0,
                        data: {
                          aplicacionEmisora: {
                            idTransaccionEmisora: 'transactionId',
                          },
                          payload: {
                            header: {
                              responseCode: 'M9000',
                              errorType: '9',
                              detail: 'Command failed',
                            },
                            payload: { data: true },
                          },
                        },
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Se ha vencido el tiempo limite de respuesta.');
  });

  test('execute: pusher error', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_error':
                      callback({ status: 500, error: 'Pusher error' });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Pusher error');
  });

  test('execute: command error (.failed)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 1,
                        fragmentOffset: 0,
                        data: {
                          nombre: 'command.failed',
                          aplicacionEmisora: {
                            idTransaccionEmisora: 'transactionId',
                          },
                          payload: {
                            header: {
                              responseCode: 'M9000',
                              errorType: '9',
                              detail: 'Command failed',
                            },
                            payload: { data: true },
                          },
                        },
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Command failed');
  });

  test('execute: command error (.failed without details)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 1,
                        fragmentOffset: 0,
                        data: {
                          nombre: 'command.failed',
                          aplicacionEmisora: {
                            idTransaccionEmisora: 'transactionId',
                          },
                          payload: {
                            header: {
                              responseCode: 'M9000',
                              errorType: '9',
                              detail: null,
                            },
                            payload: { data: true },
                          },
                        },
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Desconocido');
  });

  test('execute: command error (FAILED)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 1,
                        fragmentOffset: 0,
                        data: {
                          nombre: 'command.success', // Shoult not
                          resultado: 'FAILED',
                          aplicacionEmisora: {
                            idTransaccionEmisora: 'transactionId',
                          },
                          payload: {
                            header: {
                              responseCode: 'M9000',
                              errorType: '9',
                              detail: 'Command failed',
                            },
                            payload: { data: true },
                          },
                        },
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Command failed');
  });

  test('execute: command error (isError)', async () => {
    /* Assertions */
    await expect(
      commandService({
        ...FN_PARAMS_MOCK,
        isError: () => true,
        timeout: 0,
        pusherOptions: {
          auth: {
            headers: {
              bind: vi
                .fn()
                .mockImplementation((event: string, callback: (data?: object) => void) => {
                  switch (event) {
                    case 'pusher:subscription_succeeded':
                      callback();
                      break;
                    case 'ui.event':
                      callback({
                        fragments: 1,
                        fragmentOffset: 0,
                        data: {
                          nombre: 'command.success', // Shoult not
                          aplicacionEmisora: {
                            idTransaccionEmisora: 'transactionId',
                          },
                          payload: {
                            header: {
                              responseCode: 'M9000',
                              errorType: '9',
                              detail: 'Command failed',
                            },
                            payload: { data: true },
                          },
                        },
                      });
                      break;
                    default:
                      break;
                  }
                }),
            },
          },
        },
      } as never),
    ).rejects.toThrowError('Command failed');
  });
});

describe('class: CommandServicePreset', () => {
  beforeEach(() => {
    fetchMock();
  });

  test('execute: fetch', async () => {
    const PRESET = new CommandServicePreset({ queryKey: ['key'], ...FN_PARAMS_MOCK });

    /* Assertions */
    await expect(PRESET.fetch(FN_PARAMS_MOCK)).resolves.toEqual(EVENT_MOCK.data.payload.payload);
  });
});
