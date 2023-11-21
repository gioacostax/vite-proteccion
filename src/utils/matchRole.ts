/**
 * Project project-name
 */

/**
 * Match two roles arrays
 *
 * @param {string[]} baseRoles - Array of roles
 * @param {string[]} targetRoles - Array of roles
 * @returns {boolean} true if matches, false otherwise
 */
export default (baseRoles?: string[], targetRoles?: string[]): boolean =>
  baseRoles ? !!targetRoles?.some((role) => baseRoles.some((_role) => _role === role)) : true;
