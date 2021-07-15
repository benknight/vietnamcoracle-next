import cx from 'classnames';
import Link from 'next/link';
// @ts-ignore
import Icon from '../../public/feather-ink.svg';

export default function OldPostAlert({ className = '', monthsOld = 0 }) {
  return (
    <div
      className={cx(
        className,
        'flex items-center py-4 px-2 my-2',
        'dark:text-yellow-200 dark:text-opacity-75 rounded',
        'bg-yellow-100 bg-opacity-50 dark:bg-yellow-500 dark:bg-opacity-10',
        'border border-yellow-300 dark:border-yellow-500 dark:border-opacity-30',
      )}>
      <Icon className="fill-current self-start flex-shrink-0 w-12 h-12 mr-2 -mb-2 md:ml-1" />
      <div className="flex-auto">
        <p className="text-[12px] leading-normal sm:text-sm xl:tracking-wide">
          <span className="font-bold md:block">
            This post was last updated more than {Math.floor(monthsOld / 12)}{' '}
            years ago.
          </span>{' '}
          Please{' '}
          <a className="link" href="#comments">
            check the comments
          </a>{' '}
          section below for possible updates, or{' '}
          <Link href="/updates-accuracy">
            <a className="link">read more</a>
          </Link>{' '}
          about updates &amp; accuracy.
        </p>
      </div>
    </div>
  );
}
