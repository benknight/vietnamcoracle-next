import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PreviewAlert() {
  const router = useRouter();
  return (
    <Link
      href={`/api/exit-preview/?redirect=${encodeURIComponent(router.asPath)}`}>
      <a className="z-50 fixed flex items-center justify-center h-8 top-0 left-0 w-full bg-blue-500 dark:bg-blue-900 text-white text-xs hover:underline">
        Preview mode enabled. Click here to exit.
      </a>
    </Link>
  );
}
