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
        'bg-yellow-100 bg-opacity-50 dark:bg-transparent',
        'border border-yellow-300 dark:border-yellow-500 dark:border-opacity-30',
      )}>
      <Icon className="fill-current self-start shrink-0 w-12 h-12 mr-2 -mb-2 md:ml-1" />
      <div className="flex-auto">
        <p className="font-display text-[12px] leading-normal sm:text-sm mb-0 text-left">
          <b className="font-bold">
            This post was last updated {Math.floor(monthsOld / 12)} years ago.
          </b>{' '}
          Please{' '}
          <a className="link" href="#comments">
            check the comments
          </a>{' '}
          section for possible updates, or read more on my{' '}
          <Link href="/updates-accuracy" className="link">
            Updates &amp; Accuracy page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
