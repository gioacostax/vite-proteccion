/**
 * Project project-name
 */

import { renderHook } from '@testing-library/react';

import useWindowSize from '../useWindowSize';

test('useWindowSize() hook', () => {
  const { result } = renderHook(useWindowSize);

  /* Assertions */
  expect(result.current).toEqual({ height: 768, width: 1024 }); // Test default
});
