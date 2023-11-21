/**
 * Project vite (base-services)
 */

import * as GraphQLRequest from 'graphql-request';
import type { GraphQLClientResponse } from 'graphql-request/build/esm/types';

import graphqlService, { GraphQLServicePreset, type RealmGraphQLError } from '../graphQLService';
import type { ServiceVariables } from '../types';

///////////////////// graphql-request Mocking /////////////////////
vi.mock('graphql-request');
const rawRequestMock = <R, V extends ServiceVariables>(
  result: Partial<GraphQLClientResponse<R>>,
  isError?: boolean,
  error?: Partial<RealmGraphQLError<V>>,
) => {
  if (isError && error) {
    return vi.spyOn(GraphQLRequest, 'rawRequest').mockRejectedValue(error);
  } else if (isError) {
    return vi.spyOn(GraphQLRequest, 'rawRequest').mockResolvedValue({
      status: 500,
      errors: [{ message: 'GraphQL error' }],
      ...result,
    } as GraphQLClientResponse<R>);
  } else {
    return vi.spyOn(GraphQLRequest, 'rawRequest').mockResolvedValue({
      data: {},
      ...result,
    } as GraphQLClientResponse<R>);
  }
};
/////////////////////////////////////////////////////////////

const DATA_MOCK = { data: true };
const DATA_ERROR_MOCK = { error: true, name: 'Error', message: 'Custom error' };
const FN_PARAMS_MOCK = { url: '/api', query: '' };

describe('fn: graphqlService', () => {
  test('execute: success', async () => {
    rawRequestMock({ data: DATA_MOCK });

    /* Assertions */
    await expect(graphqlService(FN_PARAMS_MOCK)).resolves.toEqual(DATA_MOCK);
  });

  test('execute: GraphQL error', async () => {
    rawRequestMock({}, true);

    /* Assertions */
    await expect(graphqlService(FN_PARAMS_MOCK)).rejects.toThrowError('GraphQL error');
  });

  test('execute: isError (custom errorType)', async () => {
    rawRequestMock({ data: DATA_ERROR_MOCK });

    /* Assertions */
    await expect(
      graphqlService<never, typeof DATA_ERROR_MOCK>({
        ...FN_PARAMS_MOCK,
        isError: (data) => data.error,
      }),
    ).rejects.toEqual(new Error('Service error'));
  });

  test('execute: rawRequest Undefined error', async () => {
    rawRequestMock({}, true, {
      response: { status: 500, headers: { map: {} } },
    });

    /* Assertions */
    await expect(graphqlService(FN_PARAMS_MOCK)).rejects.toThrowError('GraphQL error');
  });

  test('execute: rawRequest Single error', async () => {
    rawRequestMock({}, true, {
      response: { error: 'rawRequest Single error', status: 500, headers: { map: {} } },
    });

    /* Assertions */
    await expect(graphqlService(FN_PARAMS_MOCK)).rejects.toThrowError('rawRequest Single error');
  });

  test('execute: rawRequest Array error', async () => {
    rawRequestMock({}, true, {
      response: {
        errors: [{ message: 'rawRequest Array error' } as never],
        status: 500,
        headers: { map: {} },
      },
    });

    /* Assertions */
    await expect(graphqlService(FN_PARAMS_MOCK)).rejects.toThrowError('rawRequest Array error');
  });
});

describe('class: GraphQLServicePreset', () => {
  beforeEach(() => {
    rawRequestMock({ data: DATA_MOCK });
  });

  test('execute: fetch', async () => {
    const PRESET = new GraphQLServicePreset({ queryKey: ['key'], url: '/api', query: '' });

    /* Assertions */
    await expect(PRESET.fetch()).resolves.toEqual(DATA_MOCK);
  });
});
