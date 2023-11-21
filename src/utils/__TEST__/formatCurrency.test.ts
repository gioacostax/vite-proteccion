/**
 * Project project-name
 */

import { currencyFormatter } from '../formatCurrency';

describe('currencyFormatter', () => {
  test('execute with params', () => {
    /* Assertions */
    expect(currencyFormatter(100000)).toEqual('$100,000');
  });
});
