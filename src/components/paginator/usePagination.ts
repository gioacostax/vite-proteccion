/**
 * Project vite (base-components)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * usePagination hook
 */
const usePagination = <T>(data: T[] = [], initPage = 1, initIPage = 5) => {
  const [compList, setCompList] = useState(data);
  const [list, setNewList] = useState(
    data.slice(initPage * initIPage - initIPage, initPage * initIPage),
  );
  const [pages, setPages] = useState(Math.ceil(data.length / initIPage) || 1);
  const [page, setPage] = useState(initPage);
  const [iPage, setIPage] = useState(initIPage);

  useEffect(() => {
    setNewList(compList.slice(page * iPage - iPage, page * iPage));
    setPages(Math.ceil(compList.length / iPage) || 1);
  }, [compList, page, iPage]);

  const getMore = useCallback(
    (more: number) => {
      setIPage(iPage + more);
    },
    [iPage],
  );

  const setList = useCallback(
    (newList: T[]) => {
      setCompList(newList);
      setPage(Math.ceil(newList.length / iPage) < page ? 1 : page);
    },
    [iPage, page],
  );

  const pagination = useMemo(
    () => ({
      data: {
        list,
        page,
        iPage,
        pages,
      },
      setPage,
      setIPage,
      getMore,
    }),
    [iPage, list, page, pages, getMore],
  );

  return [pagination, setList] as [typeof pagination, typeof setList];
};

export default usePagination;
