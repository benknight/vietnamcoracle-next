'use client';
import cx from 'classnames';
import Link from 'next/link';
import { MapIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import getCategoryLink from '../../../lib/getCategoryLink';
import { useState } from 'react';

export default function BrowseHero({ pageData }) {
  const [showSubcats, setShowSubcats] = useState(true);

  return (
    <div className="lg:-translate-y-8">
      <div className="page-wrap pb-4 flex-auto flex flex-wrap md:flex-nowrap items-end">
        <h1 className="sm:mr-6 font-display">
          {pageData.subcategory ? (
            <div className="text-2xl sm:text-3xl lg:text-4xl leading-normal sm:leading-tight">
              <span className="inline-block text-gray-300 opacity-90">
                <Link
                  href={getCategoryLink(pageData.category.uri)}
                  className="inline-block hover:link">
                  {pageData.category.name}{' '}
                </Link>
                &nbsp;&gt;&nbsp;
              </span>
              <span className="inline-block">{pageData.subcategory.name}</span>
            </div>
          ) : (
            <div className="text-4xl md:text-3xl lg:text-5xl leading-tight">
              {pageData.category.name}
            </div>
          )}
        </h1>
        {pageData.category.map?.mid && !pageData.subcategory && (
          <a
            className="self-end hidden md:inline-flex lg:inline-flex my-2 md:mb-1 md:order-1 items-end text-sm hover:underline"
            href="#map">
            <MapIcon className="w-5 h-5 mr-2" />
            Jump to Map
          </a>
        )}
        {pageData.category.children.nodes.length > 0 && (
          <div className="flex-auto w-full md:hidden">
            <button
              className="relative btn justify-between h-11 w-full mt-3 rounded-full bg-opacity-25"
              onClick={() => setShowSubcats(value => !value)}>
              {showSubcats
                ? pageData.subcategory
                  ? 'Show Less'
                  : 'Hide Subcategories'
                : pageData.subcategory
                ? 'Show More'
                : 'Show Subcategories'}
              <ChevronDownIcon
                className={cx(
                  'w-4 h-4 ml-2 transition-duration-100',
                  showSubcats ? 'rotate-180' : 'rotate-0',
                )}
              />
            </button>
          </div>
        )}
      </div>
      {pageData.category.children.nodes.length > 0 && (
        <div
          className={cx(
            'page-wrap pb-4 dark:pb-0 md:pr-24',
            showSubcats ? '' : 'hidden md:block',
          )}>
          {pageData.category.children.nodes.map(node => (
            <Link
              key={node.uri}
              href={getCategoryLink(node.uri)}
              scroll={false}
              className={cx(
                'inline-flex items-center h-8 2xl:h-10 mt-2 mr-1 px-[1.2em] rounded-full border bg-black leading-none whitespace-nowrap tracking-wide text-sm 2xl:text-base',
                pageData.subcategory?.uri === node.uri
                  ? 'border-primary-400 border-opacity-75 text-primary-400'
                  : 'text-white border-white border-opacity-25 hover:border-opacity-50',
              )}>
              {node.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
