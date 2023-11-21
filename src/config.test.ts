/**
 * Project vite (base-config)
 */

import { BrowserCacheLocation } from '@azure/msal-browser';

import { MSAL_CONFIG, PUSHER_CONFIG } from './config';

describe('config', () => {
  test('MSAL_CONFIG', () => {
    expect(MSAL_CONFIG).toEqual({
      auth: {
        clientId: '',
        authority: '/',
        redirectUri: 'http://localhost:3000',
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage, // Evita que se cierre la sesión
      },
    });
  });

  test('PUSHER_CONFIG', () => {
    expect(PUSHER_CONFIG).toEqual({
      appName: 'project-name',
      appId: '',
      pusherOptions: {
        forceTLS: true,
        appKey: '',
        cluster: '',
        authEndpoint: '',
      },
    });
  });
});
