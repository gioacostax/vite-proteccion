/**
 * Project vite (base-services)
 */

import type { ServiceErrorFormat } from './types';

/**
 * Custom Service Error
 * @param {ServiceErrorFormat} format ServiceErrorFormat
 */
class ServiceError extends Error {
  code: ServiceErrorFormat['code'] = null;

  constructor({ code, message, type, details }: ServiceErrorFormat) {
    super(message);
    this.name = `Service error (${type})`;
    this.code = code;
    this.stack = JSON.stringify(details);
  }
}

export default ServiceError;
