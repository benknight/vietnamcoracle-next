import cx from 'classnames';
import { gql } from 'graphql-request';
import _groupBy from 'lodash/groupBy';
import _keyBy from 'lodash/keyBy';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { Popover, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import GraphQLClient from '../lib/GraphQLClient';
import { CircularProgress } from '@material-ui/core';

export default function Menu({ children, className = '' }) {
  const { data } = useSWR(
    gql`
      query Menu {
        menuItems(where: { location: HEADER_MENU_NEXT }, first: 1000) {
          nodes {
            id
            label
            parentId
            path
            url
          }
        }
      }
    `,
    query => GraphQLClient.request(query),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            className={cx(
              className,
              'flex items-center justify-center h-11 min-w-[2.5rem] uppercase text-xs rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            )}
            id="menu-button">
            {children}
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1">
            <Popover.Panel
              static
              className="
                absolute z-10
                w-72 xs:w-80 max-h-[87vh] mt-1 lg:mt-2 overflow-auto
                font-medium font-sans text-base
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                shadow-lg
                rounded-lg
                transition">
              {data?.menuItems?.nodes ? (
                <MenuNav items={data.menuItems.nodes} open={open} />
              ) : (
                <div className="h-60 flex items-center justify-center cursor-wait">
                  <CircularProgress
                    classes={{
                      colorPrimary: 'opacity-50 text-black dark:text-white',
                    }}
                    size={32}
                    thickness={2}
                  />
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

const speed = 300;

function MenuNav({ items = [], open = false }) {
  const ref = useRef<HTMLElement>();
  const [cursor, setCursor] = useState(null);
  const [direction, setDirection] = useState('');
  const [menuHeight, setMenuHeight] = useState<number>(null);
  const byId = useMemo(() => _keyBy(items, 'id'), [items]);
  const grouped = useMemo(() => _groupBy(items, 'parentId'), [items]);

  useEffect(() => {
    if (open) {
      setCursor(null);
    }
  }, [open]);

  return (
    <nav
      className={`transition-all ease duration-${speed}`}
      ref={ref}
      style={{ height: menuHeight ? `${menuHeight}px` : undefined }}>
      {Object.keys(grouped).map(key => (
        <Transition
          as="ul"
          beforeEnter={() => {
            window.setTimeout(() => {
              const ul: HTMLElement = ref.current.querySelector(
                `[data-key="${key}"]`,
              );
              setMenuHeight(ul.offsetHeight);
            });
          }}
          className="p-2"
          data-key={key}
          enter={`transition-all ease duration-${speed} transform absolute w-full`}
          enterFrom={
            direction === 'backwards'
              ? '-translate-x-full'
              : key === 'null'
              ? 'translate-x-0'
              : 'translate-x-full'
          }
          enterTo="translate-x-0"
          key={key}
          leave={`transition-all ease duration-${speed} transform absolute w-full`}
          leaveFrom="translate-x-0"
          leaveTo={
            open
              ? direction === 'backwards'
                ? 'translate-x-full'
                : '-translate-x-full'
              : 'translate-x-0'
          }
          show={
            open ? (key === 'null' ? cursor === null : cursor === key) : false
          }
          unmount={false}>
          {key === 'null' ? null : (
            <li>
              <Link href={byId[key].path || byId[key].url}>
                <a
                  className="flex items-center h-12 px-4 text-base font-bold rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                  onClick={event => {
                    event.preventDefault();
                    setCursor(byId[key].parentId);
                    setDirection('backwards');
                  }}
                  style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <div className="flex items-center justify-center mr-3">
                    <ArrowLeftIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-auto">{byId[key].label}</div>
                </a>
              </Link>
            </li>
          )}
          {grouped[key].map(item => (
            <li key={item.url}>
              <Link href={item.path || item.url}>
                <a
                  className="flex items-center h-12 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                  onClick={event => {
                    if (grouped[item.id]) {
                      event.preventDefault();
                      setCursor(item.id);
                      setDirection('forwards');
                    } else {
                      document.getElementById('top')?.focus();
                    }
                  }}
                  style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <div className="flex-auto">{item.label}</div>
                  {grouped[item.id] && <ChevronRightIcon className="w-4 h-4" />}
                </a>
              </Link>
            </li>
          ))}
        </Transition>
      ))}
    </nav>
  );
}
