/**
 * Project vite (base-environments)
 */

export default {
  APP_MODE: import.meta.env.MODE,
  APP_ALIAS: import.meta.env.VITE_APP_ALIAS,
  APP_ID: import.meta.env.VITE_APP_ID,
  AUTH_URL_INSTANCE: import.meta.env.VITE_AUTH_URL_INSTANCE,
  AUTH_CLIENT_ID: import.meta.env.VITE_AUTH_CLIENT_ID,
  AUTH_TENANT_ID: import.meta.env.VITE_AUTH_TENANT_ID,
  PUSHER_KEY: import.meta.env.VITE_PUSHER_KEY,
  PUSHER_CLUSTER: import.meta.env.VITE_PUSHER_CLUSTER,
  PUSHER_ENDPOINT: import.meta.env.VITE_PUSHER_ENDPOINT,
  URL_SERVICES: import.meta.env.VITE_URL_SERVICES,
  // more env variables...
};
