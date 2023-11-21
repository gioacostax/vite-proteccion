/**
 * Project vite (base-utils)
 */

/**
 * format number to money value
 *
 * @param {number} value number to format
 * @returns {string} formatted number
 */
export const currencyFormatter = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    currency: 'USD',
  });
  return formatter.format(value);
};
