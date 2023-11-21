/**
 * Project vite (base-components)
 */

import { useState, useEffect, type CSSProperties } from 'react';

import { UilAngleLeft, UilAngleRight } from '@iconscout/react-unicons';

import hexGenerator from '@/utils/hexGenerator';

import Button from '../ui/button';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  style?: CSSProperties;
  pages?: number;
  page?: number;
  isDisabled?: boolean;
  onChange?: (current: number) => void;
}

/**
 * Paginator
 */
const Paginator = ({ style, className, pages = 1, page = 1, isDisabled, onChange }: Props) => {
  const [current, setCurrent] = useState(page);
  const [listPages, setlistPages] = useState<(number | null)[]>([1]);

  // Update current state if prop default changes
  useEffect(() => {
    setCurrent(page);
  }, [page]);

  // Logic for list of pages
  useEffect(() => {
    const nums: (number | null)[] = [];

    // If pages > 7
    if (pages > 7) {
      nums.push(1);

      switch (true) {
        case current === 4:
          nums.push(2);
          break;
        case current > 4:
          nums.push(null);
          break;
      }

      // Middle pages
      for (
        let x =
          current >= pages - 3
            ? Math.max(2, current - 1) - 3 + (pages - current)
            : Math.max(2, current - 1);
        x <=
        (Math.min(pages - 1, current + 1) + 4 - current <= current
          ? Math.min(pages - 1, current + 1)
          : Math.min(pages - 1, current + 1) + 4 - current);
        x += 1
      ) {
        nums.push(x);
      }

      switch (true) {
        case current < pages - 3:
          nums.push(null); // Dots
          break;
        case current === pages - 3:
          nums.push(pages - 1);
          break;
      }

      nums.push(pages);

      // If pages <= 7
    } else [...Array<never>(pages)].forEach((_, x) => nums.push(x + 1));

    setlistPages(nums);
  }, [pages, current]);

  const handleClick = (value: number) => {
    setCurrent(value);
    onChange?.(value);
  };

  return (
    <div
      style={style}
      className={[styles.paginator, className].filter(Boolean).join(' ')}
      data-theme
    >
      <Button
        disabled={isDisabled ?? current === 1}
        onClick={() => {
          handleClick(current - 1);
        }}
        size="sm"
        theme="secondary"
        style={{ padding: '0.3em 0.4em', minHeight: 'unset' }}
        data-testid="paginator-prev"
      >
        <UilAngleLeft />
      </Button>
      <div className={styles.pages}>
        {listPages.map((num) => (
          <Button
            key={`paginator-btn-${num}-${hexGenerator()}`}
            onClick={() => {
              handleClick(num!);
            }}
            variant={current === num ? 'box' : 'ghost'}
            theme="secondary"
            disabled={isDisabled ?? !num}
            style={{ padding: '0.6em 1em', minHeight: 'unset' }}
          >
            {num ?? '...'}
          </Button>
        ))}
      </div>
      <Button
        disabled={isDisabled ?? current === pages}
        onClick={() => {
          handleClick(current + 1);
        }}
        size="sm"
        theme="secondary"
        style={{ padding: '0.3em 0.4em', minHeight: 'unset' }}
        data-testid="paginator-next"
      >
        <UilAngleRight />
      </Button>
    </div>
  );
};

export default Paginator;
