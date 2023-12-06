/**
 * Project vite (base-auth)
 */

import type { Component, PropsWithChildren } from 'react';

import * as MsalReact from '@azure/msal-react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import AuthProvider, { Wrapper, useAuth } from './index';

export const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0QHByb3RlY2Npb24uY29tLmNvIiwic3ViIjoiYU9XWGg4RFJQR0NmaGlBXzRzQXhHWmxJZWJDbmx0bzltb0R3MEJjQkNtayJ9.ApZRyWXipprV2G7yh3Ob7FQq41yRQevzD1cYY09LWslDbbHdoFcaf-eqcm6aBbzz0-40_ZsXwqETWWy2CnWnBm5omwW2j81b52Yhl54C9VEa_gkZomtzjq2BfhFVvj_XRKD0VxTr0ertQvJ_QHy4TgNhTB4pksFTzRPf4oxGzG9gyhC9aZf2SgkptnDUXXvyAeSBJNNX-0AyqmtFSSGZnnfLw5bjjQStiLX6QxkV5XIxuM1GOjGT9LvILUZ04UefJAxfBUdBZy73odcIaYeWeWQyF-mPk_EZisFkBaJcnnS2tELkAek-hJPIRN_DAGgaaV7qPnSc8plcPUP_Qr-tRQ';

export const TOKEN2 =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0MkBwcm90ZWNjaW9uLmNvbS5jbyIsInN1YiI6ImFPV1hoOERSUEdDZmhpQV80c0F4R1psSWViQ25sdG85bW9EdzBCY0JDbWsifQ.tcKtVOPHlR6OCvsjLex0czkVagQVTQvJZc2O9AV5Z8KYZtsNlgTrZz5wpRd2KgHO3fawQHvVhEmmCNSmZmLDk1kLm0APjkGQzGA_Jo58v9mc1ls9IHSB8haBairgnrkj1XLOn-4tjpt5Jbym1e0OWoeFug9S6fjX4rUu26iWWZuc1CoEDZexfzyTuuKkCtd2-k6bO2xyC6m5vhx4EdsUA2aDTsSvSSxUDcU0bzZ99-26Y8tGoZYLICwjCl6XPbV70_aHaj2UkmOnYjVZuLX7--W6oIDLQ82OQKOqq9_ZXFZbJhc1Ytdk59afAQQW0ru2EfEjpQGZpFoVXcliRGha6Q';

export const ACCESS_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJpcGFkZHIiOiIwLjAuMC4wIn0.szQtlt3BnmViTDU9gZxrbUgBkoW7A3dQLbmDccqHte0';

vi.mock('@azure/msal-browser', async (requireActual) => ({
  ...(await requireActual<object>()),
  PublicClientApplication: class {
    #_ = false;

    constructor() {
      this.#_ = !this.#_;
    }
  },
}));
// vi.mock('@azure/msal-react', async (requireActual) => ({
//   ...(await requireActual<object>()),
//   MsalProvider: ({ children }: PropsWithChildren) => <>{children}</>,
// }));

describe('<AuthProvider />', () => {
  test('renders', () => {
    // vi.spyOn(MsalReact, 'MsalProvider').mockImplementation(({ children }) => <>{children}</>);
    // render(<AuthProvider>Content</AuthProvider>);
    // screen.getByText('Content');
  });
});

// describe('<Wrapper />', () => {
//   beforeEach(() => {
//     vi.spyOn(MsalReact, 'MsalAuthenticationTemplate').mockImplementation(({ children }) => (
//       <>{children}</>
//     ));
//   });

//   test('renders', () => {
//     render(<Wrapper>Content</Wrapper>);
//     expect(screen.queryByText('Content')).toBeNull();
//   });

//   test('renders loading', () => {
//     vi.spyOn(MsalReact, 'MsalAuthenticationTemplate').mockImplementation((props) => {
//       const Loader = props.loadingComponent as typeof Component;
//       return <Loader />;
//     });

//     render(<Wrapper />);
//     screen.getByText('¡Estamos cargando la mejor experiencia para ti!');
//   });

//   test('renders authenticated', () => {
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       accounts: [{ name: 'Test', username: 'test@proteccion.com.co' }],
//       controller: { instance: { initialized: true } },
//     } as never);

//     render(<Wrapper>Content</Wrapper>);
//     screen.getByText('Content');
//   });

//   test('renders with authenticating error & action: reload', () => {
//     const loginRedirect = vi.fn();
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: { instance: { loginRedirect } },
//       accounts: [],
//     } as never);
//     vi.spyOn(MsalReact, 'MsalAuthenticationTemplate').mockImplementation((props) => {
//       const Error = props.errorComponent as typeof Component;
//       return <Error />;
//     });

//     render(<Wrapper />);
//     screen.getByText('Error de autenticación');
//     fireEvent.click(screen.getByText('Reintentar autenticación'));
//     expect(loginRedirect).toHaveBeenCalled();
//   });

//   test('renders & action: getToken', async () => {
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: {
//         instance: {
//           initialized: true,
//           acquireTokenSilent: () => ({
//             idToken: TOKEN,
//             accessToken: ACCESS_TOKEN, // Has ip 0.0.0.0
//             idTokenClaims: { sub: 'sub' },
//           }),
//         },
//       },
//       accounts: [
//         {
//           name: 'Test',
//           username: 'test@proteccion.com.co',
//           idTokenClaims: { exp: new Date().getTime() },
//         },
//       ],
//     } as never);

//     const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
//     const token = await act(async () => {
//       return await result.current.getToken();
//     });
//     expect(token).toEqual({
//       idToken: TOKEN,
//       sub: 'sub',
//       ip: '0.0.0.0',
//     });
//   });

//   test('renders & action: getToken (force refresh)', async () => {
//     const getItem = vi
//       .fn()
//       .mockReturnValueOnce(
//         '{"idToken":["idToken-key"],"accessToken":["accessToken-key"],"refreshToken":["refreshToken-key"]}',
//       );
//     const setItem = vi.fn();
//     const clear = vi.fn();
//     Object.defineProperty(window, 'localStorage', {
//       value: { getItem, setItem, clear },
//     });
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: {
//         instance: {
//           initialized: true,
//           acquireTokenRedirect: vi.fn(),
//           acquireTokenSilent: () => ({
//             idToken: TOKEN,
//             accessToken: ACCESS_TOKEN, // Has ip 0.0.0.0
//             idTokenClaims: { sub: 'sub' },
//           }),
//         },
//       },
//       accounts: [{ name: 'Test', username: 'test@proteccion.com.co' }],
//     } as never);

//     const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
//     await act(async () => {
//       await result.current.getToken();
//     });
//     expect(setItem).toHaveBeenCalledWith(
//       'msal.token.keys.',
//       '{"idToken":["undefined.-login.windows.net-idtoken-----"],"accessToken":["accessToken-key"],"refreshToken":["refreshToken-key"]}',
//     );

//     // Test when failed
//     try {
//       await act(async () => {
//         await result.current.getToken();
//       });
//     } catch (err) {
//       expect(err).toEqual({
//         type: 'auth',
//         code: null,
//         message: 'No se pudo obtener la llave "msal.token.keys.<cliendId>"',
//       });
//     }
//     expect(clear).toHaveBeenCalled();
//   });

//   test('renders & action: getToken (rejects) -> redirect', async () => {
//     const acquireTokenRedirect = vi.fn().mockResolvedValue(null);
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: {
//         instance: {
//           initialized: true,
//           acquireTokenRedirect,
//           acquireTokenSilent: new Promise((_, reject) => {
//             reject({
//               errorCode: 'auth_error',
//               name: 'ClientAuthError',
//               errorMessage: 'Auth error',
//             });
//           }),
//         },
//       },
//       accounts: [{ name: 'Test', username: 'test@proteccion.com.co' }],
//     } as never);

//     const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
//     try {
//       await act(async () => {
//         await result.current.getToken();
//       });
//     } catch (err) {
//       expect(err).toEqual({
//         type: 'auth',
//         code: null,
//         message: 'Error obteniendo Token por redireccionamiento',
//       });
//     }
//     expect(acquireTokenRedirect).toHaveBeenCalled();
//   });

//   test('renders & action: getToken (rejects) -> redirect (rejects)', async () => {
//     const acquireTokenRedirect = vi.fn().mockRejectedValue({
//       errorCode: 'auth_error',
//       name: 'ClientAuthError',
//       errorMessage: 'Auth error',
//     });
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: {
//         instance: {
//           initialized: true,
//           acquireTokenRedirect,
//           acquireTokenSilent: new Promise((_, reject) => {
//             reject({
//               errorCode: 'auth_error',
//               name: 'ClientAuthError',
//               errorMessage: 'Auth error',
//             });
//           }),
//         },
//       },
//       accounts: [{ name: 'Test', username: 'test@proteccion.com.co' }],
//     } as never);

//     const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
//     try {
//       await act(async () => {
//         await result.current.getToken();
//       });
//     } catch (err) {
//       expect(err).toEqual({
//         type: 'auth',
//         code: 'auth_error',
//         message: 'Auth error',
//         details: {
//           errorCode: 'auth_error',
//           errorMessage: 'Auth error',
//           name: 'ClientAuthError',
//         },
//       });
//     }
//     expect(acquireTokenRedirect).toHaveBeenCalled();
//   });

//   test('renders & action: logout', async () => {
//     const logoutRedirect = vi.fn();
//     vi.spyOn(MsalReact, 'useMsal').mockReturnValue({
//       controller: { instance: { logoutRedirect, initialized: true } },
//       accounts: [{ name: 'Test', username: 'test@proteccion.com.co' }],
//     } as never);

//     const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
//     await result.current.logout();
//     expect(logoutRedirect).toHaveBeenCalled();
//   });
// });
