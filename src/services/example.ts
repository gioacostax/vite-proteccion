/**
 * Project project-name
 */

import ENV from '@/env';
import { FetchServicePreset } from '@/providers/services';

export { default as EXAMPLE_MOCK } from './mocks/example.json';

export interface ExampleParams {
  data: string;
}

export interface ExampleBody {
  data: string;
}

export interface ExampleResponse {
  data: boolean;
}

export const EXAMPLE = new FetchServicePreset<ExampleParams, ExampleBody, ExampleResponse>({
  queryKey: ['example'],
  method: 'POST',
  url: `${ENV.URL_SERVICES}/example`,
});
