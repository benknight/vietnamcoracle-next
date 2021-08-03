import cx from 'classnames';
import { Tab } from '@headlessui/react';
import { ViewGridIcon } from '@heroicons/react/solid';
import ViewListIcon from '@material-ui/icons/ViewList';

const tabCx = (selected: boolean, className = '') =>
  cx(
    className,
    'inline-flex items-center p-2 sm:p-3 text-sm leading-5 font-medium rounded-lg focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
    selected
      ? 'bg-white shadow text-primary-600'
      : 'text-primary-400 text-opacity-75 hover:text-opacity-100',
  );

export default function GridListTabs({ hideLabels = false }) {
  return (
    <Tab.List className="flex p-1 -mx-1 bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 rounded-xl">
      <Tab
        className={({ selected }) => tabCx(selected)}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <ViewGridIcon className="w-5 h-5" />
        <span className={cx('ml-1', { 'hidden md:inline-block': hideLabels })}>
          {' '}
          Grid
        </span>
      </Tab>
      <Tab
        className={({ selected }) => tabCx(selected, 'ml-1')}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <ViewListIcon className="w-5 h-5" />
        <span
          className={cx('ml-1.5', { 'hidden md:inline-block': hideLabels })}>
          {' '}
          List
        </span>
      </Tab>
    </Tab.List>
  );
}