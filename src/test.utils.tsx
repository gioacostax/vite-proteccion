/**
 * Project vite (base-testing)
 */

import { act, fireEvent, screen } from '@testing-library/react';

///////////////////// env Mocking /////////////////////
type Env = Partial<typeof import('@/env').default>;
const envMockObj = {} as Env;
vi.mock('@/env', () => ({ default: envMockObj }));
export const envMock = (result: Env) => Object.assign(envMockObj, result);

///////////////////// Services Mocking /////////////////////
const useQueryClientMockFn = vi.fn();
vi.mock('@tanstack/react-query', async (requireActual) => ({
  ...(await requireActual<object>()),
  useQueryClient: useQueryClientMockFn,
}));

export const useQueryClientMock = (
  results?: Partial<import('@tanstack/react-query').QueryClient>,
) => useQueryClientMockFn.mockReturnValue(results);

const useServiceQueryMockFn = vi.fn<[{ queryKey: unknown[] }]>();
const useServiceMutationMockFn = vi.fn<[{ queryKey: unknown[] }]>();
vi.mock('@/providers/services', async (requireActual) => ({
  ...(await requireActual<object>()),
  useServiceQuery: useServiceQueryMockFn,
  useServiceMutation: useServiceMutationMockFn,
}));

export const useServiceQueryMock = <
  Pa extends import('@/providers/services/lib/types').ServicePayload,
  V extends import('@/providers/services/lib/types').ServiceVariables,
  P extends import('@/providers/services/lib/types').ServiceParams,
  B extends import('@/providers/services/lib/types').ServiceBody,
  R extends import('@/providers/services/lib/types').ServiceResponse,
  D = R,
  E = R,
>(
  results?: {
    preset:
      | import('@/providers/services').FetchServicePreset<P, B, R, D, E>
      | import('@/providers/services').GraphQLServicePreset<V, R, D, E>
      | import('@/providers/services').CommandServicePreset<Pa, R, D, E>;
    result: Partial<
      import('@tanstack/react-query').UseQueryResult<
        Partial<D extends R ? R : D>,
        import('@/providers/services/lib/serviceError').default
      >
    >;
  }[],
) =>
  useServiceQueryMockFn.mockImplementation(
    (_preset) =>
      (results
        ?.slice()
        ?.reverse()
        .find(({ preset }) => _preset.queryKey.join() === preset.queryKey.join())?.result ??
        {}) as import('@tanstack/react-query').UseQueryResult<
        Partial<D extends R ? R : D>,
        import('@/providers/services/lib/serviceError').default
      >,
  );

export const useServiceMutationMock = <
  Pa extends import('@/providers/services/lib/types').ServicePayload,
  V extends import('@/providers/services/lib/types').ServiceVariables,
  P extends import('@/providers/services/lib/types').ServiceParams,
  B extends import('@/providers/services/lib/types').ServiceBody,
  R extends import('@/providers/services/lib/types').ServiceResponse,
  D = R,
  E = R,
>(
  results?: {
    preset:
      | import('@/providers/services').FetchServicePreset<P, B, R, D, E>
      | import('@/providers/services').GraphQLServicePreset<V, R, D, E>
      | import('@/providers/services').CommandServicePreset<Pa, R, D, E>;
    result: Partial<
      import('@tanstack/react-query').UseMutationResult<
        Partial<D extends R ? R : D>,
        import('@/providers/services/lib/serviceError').default,
        import('@/providers/services/types').FnPayload<Pa, V, P, B, R, D, E>
      >
    >;
  }[],
) =>
  useServiceMutationMockFn.mockImplementation(
    (_preset) =>
      (results
        ?.slice()
        ?.reverse()
        .find(({ preset }) => _preset.queryKey.join() === preset.queryKey.join())?.result ??
        {}) as import('@tanstack/react-query').UseMutationResult<
        Partial<D extends R ? R : D>,
        import('@/providers/services/lib/serviceError').default,
        import('@/providers/services/types').FnPayload<Pa, V, P, B, R, D, E>
      >,
  );

///////////////////// ServiceError Instance Mock /////////////////////
import ServiceError from '@/providers/services/lib/serviceError';

export const SERVICE_ERROR_MOCK = new ServiceError({
  code: 500,
  message: 'Test error',
  type: 'fetch',
  details: null,
});

///////////////////// Select Testing /////////////////////
export const testSelect = (
  element: Element | Node | Document | Window,
  option: string,
  click?: boolean,
  search?: string,
) => {
  act(() => {
    fireEvent.click(element);
  });

  let optionElement: HTMLOptionElement;

  if (!search) optionElement = screen.getByText(option);
  else {
    act(() => {
      fireEvent.input(screen.getByPlaceholderText('buscar...'), { target: { value: search } });
    });
    optionElement = screen.getByText(option);
  }

  if (click) {
    act(() => {
      fireEvent.click(optionElement);
    });
  }

  return optionElement;
};

///////////////////// Msal Auth Provider Mocking /////////////////////
// eslint-disable-next-line import/order
import type { PropsWithChildren } from 'react';
export const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0QHByb3RlY2Npb24uY29tLmNvIiwic3ViIjoiYU9XWGg4RFJQR0NmaGlBXzRzQXhHWmxJZWJDbmx0bzltb0R3MEJjQkNtayJ9.ApZRyWXipprV2G7yh3Ob7FQq41yRQevzD1cYY09LWslDbbHdoFcaf-eqcm6aBbzz0-40_ZsXwqETWWy2CnWnBm5omwW2j81b52Yhl54C9VEa_gkZomtzjq2BfhFVvj_XRKD0VxTr0ertQvJ_QHy4TgNhTB4pksFTzRPf4oxGzG9gyhC9aZf2SgkptnDUXXvyAeSBJNNX-0AyqmtFSSGZnnfLw5bjjQStiLX6QxkV5XIxuM1GOjGT9LvILUZ04UefJAxfBUdBZy73odcIaYeWeWQyF-mPk_EZisFkBaJcnnS2tELkAek-hJPIRN_DAGgaaV7qPnSc8plcPUP_Qr-tRQ';

const useAuthMockFn = vi.fn<[], Partial<import('@/providers/auth')._AuthContext>>();
vi.mock('@/providers/auth', () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
  useAuth: useAuthMockFn,
}));

export const useAuthMock = (
  { logout = vi.fn(), idToken = TOKEN, roles = ['RoleA'] },
  throwError?: boolean,
) => {
  const getToken = throwError
    ? vi.fn().mockRejectedValue(
        new ServiceError({
          type: 'auth',
          code: 'auth_error',
          message: 'Auth error',
          details: null,
        }),
      )
    : vi.fn().mockResolvedValue({
        idToken,
        ip: '127.0.0.1',
        sub: 'sub',
      });
  useAuthMockFn.mockReturnValue({
    data: { email: 'test@mail.com', name: 'Test' },
    roles,
    getToken,
    logout,
  });
  return { getToken };
};

///////////////////// useToast Mocking /////////////////////
const useToastMockFn = vi.fn<
  [string],
  { addToast: (type: 'info' | 'success' | 'warn' | 'danger', content: string) => void }
>();
vi.mock('@/components/ui/toast', async (requireActual) => ({
  ...(await requireActual<object>()),
  useToast: useToastMockFn,
}));

export const useToastMock = (addToast = vi.fn()) => {
  useToastMockFn.mockReturnValue({ addToast });
  return { addToast };
};
