/**
 * Project vite (base-auth)
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type PropsWithChildren,
  useEffect,
} from 'react';

import {
  type ClientAuthError,
  type IPublicClientApplication,
  InteractionType,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  MsalAuthenticationResult,
  MsalAuthenticationTemplate,
  MsalProvider,
  useMsal,
} from '@azure/msal-react';
import { jwtDecode } from 'jwt-decode';

import LoaderModal from '@/components/loaderModal';
import Modal from '@/components/modal';
import Button from '@/components/ui/button';
import { MSAL_CONFIG } from '@/config';
import ENV from '@/env';
import ServiceError from '@/providers/services/lib/serviceError';

export type Token = {
  idToken: string;
  sub: string;
  ip: string;
};

export type _AuthContext = {
  data: {
    name?: string;
    email?: string;
  };
  roles: string[];
  logout: () => Promise<void>;
  getToken: () => Promise<Token>;
};

const AuthContext = createContext({} as _AuthContext);

export const useAuth = () => useContext(AuthContext);

export const Wrapper = ({ children }: PropsWithChildren) => {
  const { instance, accounts } = useMsal();
  const [roles, setRoles] = useState<string[]>([]);

  const activeAccount = useMemo(() => (accounts.length ? accounts[0] : undefined), [accounts]);
  const request = useMemo(() => ({ account: activeAccount, scopes: ['profile'] }), [activeAccount]);

  // MSAL instance uses initialized key but isn't typed
  const initialized = !!(
    instance as IPublicClientApplication & { controller: { initialized: boolean } }
  ).controller.initialized;

  const logout = useCallback(async () => {
    localStorage.clear();
    await instance.logoutRedirect({ account: activeAccount });
  }, [instance, activeAccount]);

  const getToken = useCallback(
    () =>
      new Promise<Token>((resolve, reject: Reject<ServiceError>) => {
        const forceRefresh =
          !activeAccount!.idTokenClaims?.exp ||
          new Date(activeAccount!.idTokenClaims.exp * 1000) < new Date();
        instance
          .acquireTokenSilent({
            ...request,
            forceRefresh,
          })
          .then(({ idToken, idTokenClaims, accessToken }) => {
            // MSAL bug: after refresh token, doesn't update the tokenId key in the storage, this is a temporary solution
            if (forceRefresh) {
              const storageToken = localStorage.getItem(`msal.token.keys.${ENV.AUTH_CLIENT_ID}`);

              if (storageToken) {
                localStorage.setItem(
                  `msal.token.keys.${ENV.AUTH_CLIENT_ID}`,
                  JSON.stringify({
                    ...JSON.parse(storageToken),
                    idToken: [
                      `${activeAccount!.localAccountId}.${
                        ENV.AUTH_TENANT_ID
                      }-login.windows.net-idtoken-${ENV.AUTH_CLIENT_ID}-${ENV.AUTH_TENANT_ID}---`,
                    ],
                  }),
                );
              } else {
                localStorage.clear();
                reject(
                  new ServiceError({
                    type: 'auth',
                    code: null,
                    message: 'No se pudo obtener la llave "msal.token.keys.<cliendId>"',
                  }),
                );
              }
            }

            setRoles((idTokenClaims as { roles?: string[] }).roles ?? []);
            resolve({
              idToken,
              sub: (idTokenClaims as { sub: string }).sub,
              ip: jwtDecode<{ ipaddr: string }>(accessToken).ipaddr,
            });
          })
          .catch(() => {
            instance
              .acquireTokenRedirect(request)
              .then(() => {
                reject(
                  new ServiceError({
                    type: 'auth',
                    code: null,
                    message: 'Error obteniendo Token por redireccionamiento',
                  }),
                );
              })
              .catch((err: ClientAuthError) => {
                reject(
                  new ServiceError({
                    type: 'auth',
                    code: err.errorCode,
                    message: err.errorMessage,
                    details: err,
                  }),
                );
              });
          });
      }),
    [activeAccount, request, instance],
  );

  const contextValue: _AuthContext = useMemo(
    () => ({
      data: {
        name: activeAccount?.name,
        email: activeAccount?.username,
      },
      roles,
      logout,
      getToken,
    }),
    [activeAccount, getToken, logout, roles],
  );

  useEffect(() => {
    if (initialized) {
      getToken().catch(() => undefined);
    }
  }, [initialized, getToken]);

  const loaderComponent = () => <LoaderModal isVisible />;
  const errorComponent = ({ error }: MsalAuthenticationResult) => (
    <Modal
      title="Error de autenticación"
      icon="danger"
      isVisible
      actions={
        <Button
          onClick={() => {
            void instance.loginRedirect(request);
          }}
        >
          Reintentar autenticación
        </Button>
      }
    >
      <strong>
        No es posible iniciar sesión:
        <br />
        <br />
      </strong>
      <code>{error?.message}</code>
    </Modal>
  );

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={request}
      loadingComponent={loaderComponent}
      errorComponent={errorComponent}
    >
      {
        /* activeAccount && */ initialized && (
          <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
        )
      }
    </MsalAuthenticationTemplate>
  );
};

const AuthProvider = ({ children }: PropsWithChildren) => (
  <MsalProvider instance={new PublicClientApplication(MSAL_CONFIG)}>
    <Wrapper>{children}</Wrapper>
  </MsalProvider>
);

export default AuthProvider;
