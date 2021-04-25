import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/solid';

export default function OldPostAlert({ monthsOld = 0 }) {
  return (
    <div className="flex items-center py-3 px-2 mt-8 mb-4 text-sm rounded bg-yellow-100 dark:bg-yellow-900  dark:bg-opacity-25 dark:border dark:border-yellow-500">
      <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
      <div className="flex-auto ml-2 leading-tight">
        This article was last updated more than {Math.floor(monthsOld / 12)}{' '}
        years ago.{' '}
        <Link href="/updates-and-accuracy">
          <a className="link">Read more about accuracy &amp; updates</a>
        </Link>
      </div>
    </div>
  );
}
