/**
 * Project vite (base-services)
 */

import ServiceError from '../serviceError';

test('class: ServiceError', () => {
  expect(
    new ServiceError({
      code: 500,
      message: 'Custom error',
      type: 'fetch',
      details: { data: 'Details' },
    }).message,
  ).toBe('Custom error');
});
