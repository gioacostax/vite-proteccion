/**
 * Project vite (base-environments)
 */

import env from './env';

test('variables', () => {
  /* Assertions */
  // From .env.test file
  expect(env.APP_ALIAS).toBe('project-name');
  // more env variables...
});
