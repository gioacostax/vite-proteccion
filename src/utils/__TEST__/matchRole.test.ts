/**
 * Project project-name
 */

import matchRole from '../matchRole';

describe('matchRole', () => {
  test('execute', () => {
    /* Assertions */
    expect(matchRole()).toBeTruthy();
  });

  test('execute with params', () => {
    /* Assertions */
    expect(matchRole(['auth'], ['auth'])).toBeTruthy();
  });
});
