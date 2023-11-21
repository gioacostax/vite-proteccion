/**
 * Project vite (base-services)
 */

import type { FC, PropsWithChildren } from 'react';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { FetchServicePreset } from '../lib/fetchService';
import useServiceQuery from '../useServiceQuery';

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

const QueryProvider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

const PRESET_MOCK = new FetchServicePreset({ queryKey: ['key'], method: 'GET', url: '/api' });
const DATA_MOCK = { data: true };

describe('useServiceQuery hook', () => {
  beforeEach(() => {
    fetchMock({ json: () => Promise.resolve(DATA_MOCK) });
  });

  test('renders hook', async () => {
    const { result } = renderHook(() => useServiceQuery(PRESET_MOCK), {
      wrapper: QueryProvider,
    });

    /* Assertions */
    await waitFor(() => {
      expect(result.current.data).toEqual(DATA_MOCK);
    });
  });
});
