/**
 * Project vite (base-utils)
 */

import { v4 as uuid } from 'uuid';

/**
 * Generate a unique ID
 *
 * @param {number} size Length of the ID
 * @returns {string} ID string
 */
export default (size = 4) => uuid().slice(-size);
