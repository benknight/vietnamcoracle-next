'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import checkHomePath from '../lib/checkHomePath';

export default function ExitPreviewLink() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = checkHomePath(pathname || '/');

  return (
    <div className="absolute top-full left-0 w-full flex justify-center">
      <Link
        href={`/api/preview/?exit=1&redirect=${encodeURIComponent(
          isHome ? '/' : `${pathname}?${searchParams}` || '/',
        )}`}
        className="flex items-center justify-center h-5 mt-1 px-4 bg-yellow-300 dark:bg-opacity-75 hover:bg-opacity-100 text-black text-xs font-medium shadow rounded-full">
        You are viewing in Preview Mode. Click here to exit.
      </Link>
    </div>
  );
}
