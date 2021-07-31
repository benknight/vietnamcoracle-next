import cx from 'classnames';
import { Tab } from '@headlessui/react';
import { ViewGridIcon } from '@heroicons/react/solid';
import ViewListIcon from '@material-ui/icons/ViewList';

const tabClassName = ({ selected }) =>
  cx(
    'inline-flex items-center p-2 sm:p-3 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60',
    selected
      ? 'bg-white shadow text-indigo-600'
      : 'text-indigo-400 text-opacity-75 hover:text-opacity-100',
  );

export default function GridListTabs() {
  return (
    <Tab.List className="flex p-1 -mx-1 bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 rounded-xl">
      <Tab className={tabClassName}>
        <ViewListIcon className="w-5 h-5" />
        <span className="hidden md:inline-block ml-1.5"> List</span>
      </Tab>
      <Tab className={tabClassName}>
        <ViewGridIcon className="w-5 h-5" />
        <span className="hidden md:inline-block ml-1"> Grid</span>
      </Tab>
    </Tab.List>
  );
}
