/**
 * Project vite (base-components)
 */

import { renderHook, act } from '@testing-library/react';

import usePagination from './usePagination';

const LIST = [1, 2, 3, 4, 5, 6];

describe('usePagination hook', () => {
  test('renders hook', () => {
    const { result } = renderHook(() => usePagination());

    /* Assertions */
    expect(result.current[0].data.list).toEqual([]);
  });

  test('renders hook with params', () => {
    const { result } = renderHook(() => usePagination(LIST, 1, 6));

    /* Assertions */
    expect(result.current[0].data.list).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('renders hook and execute: "setList([2, 3])"', () => {
    const { result } = renderHook(() => usePagination(LIST, 1, 3));

    /* Actions */
    act(() => {
      result.current[1]([2, 3]);
    });

    /* Assertions */
    expect(result.current[0].data.list).toEqual([2, 3]);
  });

  test('renders hook and execute: "setList([2, 3, 4, 5])" -> set page 2', () => {
    const { result } = renderHook(() => usePagination(LIST, 2, 5));

    /* Actions */
    act(() => {
      result.current[1]([2, 3, 4, 5]);
    });

    /* Assertions */
    expect(result.current[0].data.list).toEqual([2, 3, 4, 5]);
  });

  test('renders hook and execute: "getMore(3)"', () => {
    const { result } = renderHook(() => usePagination(LIST, 1, 3));

    /* Actions */
    act(() => {
      result.current[0].getMore(3);
    });

    /* Assertions */
    expect(result.current[0].data.list).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
