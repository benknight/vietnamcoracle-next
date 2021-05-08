// import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/outline';

export default function OldPostAlert({ monthsOld = 0 }) {
  return (
    <div className="flex items-center py-4 px-2 mb-4 mt-3 rounded bg-yellow-100 dark:bg-yellow-900  dark:bg-opacity-25 dark:border dark:border-yellow-600">
      <ClockIcon className="self-start flex-shrink-0 w-6 h-6 ml-1 mr-2 text-yellow-600 dark:text-yellow-500" />
      <div className="text-xs sm:text-sm flex-auto leading-tight">
        <p>
          Heads up, this post was last updated more than{' '}
          {Math.floor(monthsOld / 12)} years ago. Check the{' '}
          <a className="link" href="#comments">
            comments
          </a>{' '}
          section below for possible updates.
          {/* <Link href="/updates-and-accuracy">
            <a className="block mt-2 md:inline md:mt-0 link">
              Read more about accuracy &amp; updates
            </a>
          </Link> */}
        </p>
      </div>
    </div>
  );
}
