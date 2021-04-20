import cx from 'classnames';
import { gql } from 'graphql-request';
import _groupBy from 'lodash/groupBy';
import _keyBy from 'lodash/keyBy';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Popover, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/solid';
import GraphQLClient from '../lib/GraphQLClient';

const fetcher = query => GraphQLClient.request(query);

export default function Menu() {
  const { data, error } = useSWR(
    gql`
      query Menu {
        menuItems(where: { location: HEADER_MENU }, first: 1000) {
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
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  return (
    <Popover className="ml-2">
      {({ open }) => (
        <>
          <Popover.Button
            className="
              flex items-center p-2 md:px-3 uppercase text-xs rounded-full
              hover:bg-gray-100 hover:dark:bg-gray-800
              focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
            <div className="hidden md:block mr-1 tracking-wider">Menu</div>
            <ChevronDownIcon className="w-5 h-5" />
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1">
            <Popover.Panel
              static
              className="
                absolute z-10 left-1 md:left-auto
                w-72 max-h-[87vh] mt-3 p-2 overflow-auto
                font-medium
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                shadow-lg
                rounded-lg
                transition">
              <MenuNav items={data?.menuItems.nodes ?? []} open={open} />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

function MenuNav({ items = [], open = false }) {
  const [cursor, setCursor] = useState(null);
  const byId = useMemo(() => _keyBy(items, 'id'), [items]);
  const grouped = useMemo(() => _groupBy(items, 'parentId'), [items]);

  useEffect(() => {
    if (open) {
      setCursor(null);
    }
  }, [open]);

  return (
    <nav>
      {Object.keys(grouped).map(key => (
        // <Transition
        //   as="ul"
        //   enter="transition-all ease duration-200 transform absolute"
        //   enterFrom="-translate-x-full"
        //   enterTo="translate-x-0"
        //   key={key}
        //   leave="transition-all ease duration-150 transform absolute"
        //   leaveFrom="translate-x-0"
        //   leaveTo="-translate-x-full"
        //   show={key === 'null' ? cursor === null : cursor === key}>
        <ul
          className={cx({
            hidden: key === 'null' ? cursor !== null : cursor !== key,
          })}>
          {key === 'null' ? null : (
            <li>
              <Link href={byId[key].path || byId[key].url}>
                <a
                  className="group flex items-center p-3 text-lg font-bold rounded hover:bg-gray-100 hover:dark:bg-gray-700"
                  onClick={event => {
                    event.preventDefault();
                    setCursor(byId[key].parentId);
                  }}>
                  <div className="flex items-center justify-center mr-3 p-2 dark:bg-gray-700 group-hover:dark:bg-gray-500 rounded-full">
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
                  className="flex items-center p-3 rounded hover:bg-gray-100 hover:dark:bg-gray-700"
                  onClick={event => {
                    if (grouped[item.id]) {
                      event.preventDefault();
                      setCursor(item.id);
                    }
                  }}>
                  <div className="flex-auto">{item.label}</div>
                  {grouped[item.id] ? (
                    <ChevronRightIcon className="w-4 h-4" />
                  ) : null}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
