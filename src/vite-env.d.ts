/**
 * Project vite (base-environments)
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ALIAS: string;
  readonly VITE_APP_ID: string;
  readonly VITE_AUTH_URL_INSTANCE: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_TENANT_ID: string;
  readonly VITE_PUSHER_KEY: string;
  readonly VITE_PUSHER_CLUSTER: string;
  readonly VITE_PUSHER_ENDPOINT: string;
  readonly VITE_URL_SERVICES: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
