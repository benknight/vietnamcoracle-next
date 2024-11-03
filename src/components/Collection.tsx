import cx from 'classnames';
import _shuffle from 'lodash/shuffle';
import { ReactNode, RefObject, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import useCarousel from '../lib/useCarousel';

interface Props {
  items: ReactNode[];
  heading: ReactNode;
}

const Collection = ({ items, heading }: Props) => {
  if (items.length === 0) {
    return null;
  }

  const {
    getLeftNavProps,
    getRightNavProps,
    isTouchDevice,
    scrollAreaRef,
    scrollPosition,
  } = useCarousel();

  const navButtonClassName =
    'flex items-center justify-center absolute z-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black hover:bg-blue-400 transition-colors duration-50 ease-out bg-opacity-75 text-white top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black hover:bg-blue-400 transition-colors duration-50 ease-out bg-opacity-75 text-white';

  return (
    <section className="my-6 md:my-12">
      <div className="page-wrap flex items-baseline justify-between md:justify-start">
        <h3 className="sm:mb-2 font-display sm:text-2xl 2xl:text-2xl dark:text-gray-200 group">
          {heading}
        </h3>
      </div>
      <div className="relative my-3 lg:my-4 overflow-hidden">
        {!isTouchDevice && scrollPosition && (
          <button
            className={cx(
              navButtonClassName,
              'left-2',
              scrollPosition === 'start' && 'opacity-0',
            )}
            {...getLeftNavProps()}>
            <ArrowLeftIcon className="w-7 h-7" />
          </button>
        )}
        {!isTouchDevice && scrollPosition && (
          <button
            className={cx(
              navButtonClassName,
              'right-2',
              scrollPosition === 'end' && 'opacity-0',
            )}
            {...getRightNavProps()}>
            <ArrowRightIcon className="w-7 h-7" />
          </button>
        )}
        <div className="overflow-hidden">
          <ol
            className="sm:snap-x xl:snap-none flex pb-8 -mb-8 pr-4 md:pr-8 overflow-y-auto"
            ref={scrollAreaRef as RefObject<HTMLOListElement>}>
            {items.map((item, index) => (
              <li
                className="snap-start flex shrink-0 w-4/5 sm:w-3/7 lg:w-1/3 xl:min-w-[20rem] xl:max-w-[25rem] py-1 pl-3 lg:pl-4 xl:pl-3 2xl:pl-6 md:first:pl-8"
                key={index}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Collection;
