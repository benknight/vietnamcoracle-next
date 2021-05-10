// import Link from 'next/link';
// @ts-ignore
import FossilIcon from '../../public/fossil.svg';

export default function OldPostAlert({ monthsOld = 0 }) {
  return (
    <div className="flex items-center py-4 px-2 mb-4 mt-3 rounded bg-yellow-100 bg-opacity-50 dark:bg-yellow-500  dark:bg-opacity-10 border border-yellow-100 dark:border-yellow-500">
      <span title="Science magnifying glass fossil by Maxicons from the Noun Project">
        <FossilIcon className="self-start flex-shrink-0 w-16 h-16 ml-1 mr-2 -mb-2" />
      </span>
      <div className="flex-auto leading-tight">
        <p className="text-base">
          Heads up, this post was last updated more than{' '}
          {Math.floor(monthsOld / 12)} years ago.
        </p>
        <p className="text-xs sm:text-sm">
          Check the{' '}
          <a className="link" href="#comments">
            comments section
          </a>{' '}
          below for possible updates.
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
