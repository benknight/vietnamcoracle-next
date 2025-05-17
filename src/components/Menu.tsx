'use client';
import cx from 'classnames';
import _groupBy from 'lodash/groupBy';
import _keyBy from 'lodash/keyBy';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HomeIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import { fetchMenu } from '../app/actions';
import getCategoryLink from '../lib/getCategoryLink';

interface Props {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function Menu({ children, className = '', fullWidth }: Props) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchMenu>>>();

  useEffect(() => {
    fetchMenu().then(data => setData(data));
  }, []);

  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton
            className={cx(
              className,
              'flex items-center justify-center h-11 min-w-[2.5rem] uppercase text-xs rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 focus:outline-none focus-visible:bg-gray-200 dark:focus-visible:bg-gray-700',
            )}
            id="menu-button">
            {children}
          </PopoverButton>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1">
            <PopoverPanel
              static
              className={cx(
                'z-10 absolute left-0 xs:left-auto w-screen xs:w-[80vw] sm:w-96 max-h-[87vh] mt-1 lg:mt-2 overflow-y-auto overflow-x-hidden font-medium font-display bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg transition',
                fullWidth ? '' : '2xl:-left-3',
              )}>
              {({ close }) =>
                data?.menuItems?.nodes ? (
                  <MenuNav
                    close={close}
                    items={data.menuItems.nodes}
                    open={open}
                  />
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
                )
              }
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

const speed = 300;

interface MenuNavProps {
  close?: () => void;
  items: {
    id: string;
    label: string;
    parentId: string | null;
    path: string;
    url: string;
  }[];
  open?: boolean;
}

function MenuNav({ close = () => {}, items = [], open = false }: MenuNavProps) {
  const ref = useRef<HTMLElement>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [direction, setDirection] = useState('');
  const [menuHeight, setMenuHeight] = useState<number | null>(null);
  const byId = useMemo(() => _keyBy(items, 'id'), [items]);
  const grouped = useMemo(() => _groupBy(items, 'parentId'), [items]);

  useEffect(() => {
    if (open) {
      setCursor(null);
      // Initialize menu height
      setMenuHeight(ref.current!.offsetHeight);
    }
  }, [open]);

  return (
    <nav
      className={`transition-all ease duration-${speed} text-sm`}
      ref={ref}
      style={{ height: menuHeight ? `${menuHeight}px` : undefined }}>
      {Object.keys(grouped).map(key => (
        <Transition
          as="ul"
          beforeEnter={() => {
            window.setTimeout(() => {
              const ul = ref.current!.querySelector(`[data-key="${key}"]`);
              if (ul) {
                setMenuHeight((ul as HTMLElement).offsetHeight);
              }
            });
          }}
          className="p-2"
          data-key={key}
          enter={`transition-all ease duration-${speed} absolute w-full`}
          enterFrom={
            direction === 'backwards'
              ? '-translate-x-full'
              : key === 'null'
              ? 'translate-x-0'
              : 'translate-x-full'
          }
          enterTo="translate-x-0"
          key={key}
          leave={`transition-all ease duration-${speed} absolute w-full`}
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
          }>
          {key === 'null' ? null : (
            <li>
              <Link
                href={byId[key].path || byId[key].url}
                className="flex items-center h-14 px-6 font-bold rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                onClick={event => {
                  event.preventDefault();
                  setCursor(byId[key].parentId);
                  setDirection('backwards');
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                <div className="flex items-center justify-center mr-3">
                  <ArrowLeftIcon className="w-4 h-4" />
                </div>
                <div className="flex-auto">{byId[key].label}</div>
              </Link>
            </li>
          )}
          {grouped[key].map(item => (
            <li key={item.id}>
              <Link
                href={getCategoryLink(item.path || item.url)}
                className="flex items-center h-14 px-6 rounded hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                onClick={event => {
                  if (grouped[item.id]) {
                    event.preventDefault();
                    setCursor(item.id);
                    setDirection('forwards');
                  } else {
                    close();
                  }
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                {item.label === 'Home' && (
                  <HomeIcon className="inline-flex w-4 h-5 mr-2 -mt-px" />
                )}
                <div className="flex-auto">{item.label}</div>
                {grouped[item.id] && <ChevronRightIcon className="w-5 h-5" />}
              </Link>
            </li>
          ))}
        </Transition>
      ))}
    </nav>
  );
}
