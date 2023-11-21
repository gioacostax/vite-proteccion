/**
 * Project vite (base-services)
 */

import fetchService, { FetchServicePreset } from '../fetchService';

///////////////////// fetch Mocking /////////////////////
const fetchMock = (result: Partial<Response>, isError?: boolean, error?: Error) => {
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
/////////////////////////////////////////////////////////////

const DATA_MOCK = { data: true };
const DATA_ERROR_MOCK = { error: true, name: 'Error', message: 'Custom error' };
const FN_PARAMS_MOCK = { url: '/api', method: 'GET' };

describe('fn: fetchService', () => {
  test('execute: success', async () => {
    fetchMock({ json: () => Promise.resolve(DATA_MOCK) });

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).resolves.toEqual(DATA_MOCK);
  });

  test('execute without "Content-Type" header: success', async () => {
    fetchMock({ headers: new Headers() });

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).resolves.toBeUndefined();
  });

  test('execute with params and body: success', async () => {
    const mock = fetchMock({ json: () => Promise.resolve(DATA_MOCK) });
    await fetchService({
      ...FN_PARAMS_MOCK,
      params: { param1: 'valid', param2: '' },
      body: { token: 'token' },
    });

    /* Assertions */
    expect(mock).toHaveBeenCalledWith('/api?param1=valid', {
      body: '{"token":"token"}',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
  });

  test('execute: json error', async () => {
    fetchMock({ json: () => Promise.reject(DATA_ERROR_MOCK) });

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).rejects.toThrowError(
      `${DATA_ERROR_MOCK.name}: ${DATA_ERROR_MOCK.message}`,
    );
  });

  test('execute: cors error', async () => {
    fetchMock(
      {
        json: () => Promise.reject(DATA_ERROR_MOCK),
        statusText: 'Cors error',
      },
      true,
    );

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).rejects.toThrowError('Cors error');
  });

  test('execute: service error', async () => {
    fetchMock(
      {
        json: () => Promise.resolve(DATA_ERROR_MOCK),
        statusText: 'Service error',
      },
      true,
    );

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).rejects.toThrowError('Service error');
  });

  test('execute: isError (custom errorType)', async () => {
    fetchMock({
      json: () => Promise.resolve(DATA_ERROR_MOCK),
    });

    /* Assertions */
    await expect(
      fetchService<never, never, never, typeof DATA_ERROR_MOCK>({
        ...FN_PARAMS_MOCK,
        isError: (data) => data.error,
      }),
    ).rejects.toThrowError('Service error');
  });

  test('execute: fetch error', async () => {
    fetchMock({}, true, new Error('Fetch error'));

    /* Assertions */
    await expect(fetchService(FN_PARAMS_MOCK)).rejects.toThrowError('Fetch error');
  });
});

describe('class: FetchServicePreset', () => {
  beforeEach(() => {
    fetchMock({ json: () => Promise.resolve(DATA_MOCK) });
  });

  test('execute: fetch', async () => {
    const PRESET = new FetchServicePreset({ queryKey: ['key'], method: 'GET', url: '/api' });

    /* Assertions */
    await expect(PRESET.fetch()).resolves.toEqual(DATA_MOCK);
  });
});
