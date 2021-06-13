import cx from 'classnames';
import Link from 'next/link';
// @ts-ignore
import Icon from '../../public/feather-ink.svg';

export default function OldPostAlert({ monthsOld = 0 }) {
  return (
    <div
      className={cx(
        'flex items-center py-4 px-1 mb-4 mt-3',
        'dark:text-yellow-200 dark:text-opacity-75 rounded',
        'bg-yellow-100 bg-opacity-50 dark:bg-yellow-500 dark:bg-opacity-10',
        'border border-yellow-300 dark:border-yellow-500 dark:border-opacity-30',
      )}>
      <Icon className="fill-current self-start flex-shrink-0 w-16 h-16 ml-1 mr-2 -mb-2" />
      <div className="flex-auto">
        <p className="text-sm font-bold">
          This post was last updated more than {Math.floor(monthsOld / 12)}{' '}
          years ago.
        </p>
        <p className="text-sm">
          <a className="link" href="#comments">
            Check the comments
          </a>{' '}
          section below for possible updates.{' '}
          <Link href="/updates-accuracy">
            <a className="link">Read more</a>
          </Link>{' '}
          about updates &amp; accuracy.
        </p>
      </div>
    </div>
  );
}
