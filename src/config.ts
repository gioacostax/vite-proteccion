/**
 * Project vite (base-config)
 */

import { BrowserCacheLocation, type Configuration } from '@azure/msal-browser';

import ENV from '@/env';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: ENV.AUTH_CLIENT_ID,
    authority: `${ENV.AUTH_URL_INSTANCE}/${ENV.AUTH_TENANT_ID}`,
    redirectUri: location.origin,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Evita que se cierre la sesión
  },
};

export const PUSHER_CONFIG = {
  appName: ENV.APP_ALIAS,
  appId: ENV.APP_ID,
  pusherOptions: {
    forceTLS: true,
    appKey: ENV.PUSHER_KEY,
    cluster: ENV.PUSHER_CLUSTER,
    authEndpoint: ENV.PUSHER_ENDPOINT,
  },
};
