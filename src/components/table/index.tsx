/**
 * Project vite (base-components)
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react';

import Shimmer from '../ui/shimmer';

import styles from './styles.module.scss';

interface Column {
  render: ReactNode;
  width: CSSProperties['width'];
}

export interface Props<Item extends Record<string, unknown>, P extends Record<string, Column>> {
  className?: string;
  style?: CSSProperties;

  data: Item[];
  dataKey: keyof Item;
  format: P & Partial<Record<keyof Item, Column>>;
  parseData: (item: Item) => Record<keyof P, ReactNode>;

  title?: ReactNode;
  hideHeader?: boolean;
  isLoading?: boolean;
  emptyLabel?: ReactNode;
  footer?: ReactNode;
}

/**
 * Table Component
 */
const Table = <Item extends Record<string, unknown>, P extends Record<string, Column>>({
  className,
  style,
  data,
  dataKey,
  format,
  parseData,
  title,
  hideHeader,
  isLoading,
  emptyLabel = 'No hay registros',
  footer,
}: Props<Item, P>) => {
  const renderedData = useMemo(
    () =>
      data.length ? (
        data.map((item) => (
          <data key={String(item[dataKey])} className={styles.row} role="row">
            {Object.keys(format).map((key) => (
              <div
                key={`body-column-${key}`}
                className={styles.column}
                style={{ width: format[key].width }}
              >
                <span className={styles.title}>{format[key].render}</span>
                {parseData(item)[key]}
              </div>
            ))}
          </data>
        ))
      ) : (
        <div className={styles.empty}>{emptyLabel}</div>
      ),
    [data, dataKey, emptyLabel, format, parseData],
  );

  const renderedRowShimmer = useMemo(
    () => (
      <data className={styles.row} role="row">
        {Object.keys(format).map((key) => (
          <div
            key={`header-column-${key}`}
            className={styles.column}
            style={{ width: format[key].width }}
          >
            <Shimmer style={{ height: '1.5em' }} data-testid="shimmer" />
          </div>
        ))}
      </data>
    ),
    [format],
  );

  return (
    <div
      className={[styles.table, className].filter(Boolean).join(' ')}
      style={style}
      role="table"
      data-responsive
    >
      {title && <span className={styles.title}>{title}</span>}
      {!hideHeader && (
        <div className={styles.header} role="rowheader" data-testid="table-header">
          {Object.keys(format).map((key) => (
            <div
              key={`header-column-${key}`}
              className={styles.column}
              style={{ width: format[key].width }}
            >
              {format[key].render}
            </div>
          ))}
        </div>
      )}
      <div className={styles.body}>
        {isLoading ? (
          <>
            {renderedRowShimmer}
            {renderedRowShimmer}
          </>
        ) : (
          renderedData
        )}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Table;
