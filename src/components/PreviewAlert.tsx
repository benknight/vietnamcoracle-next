import Link from 'next/link';

export default function PreviewAlert() {
  return (
    <div className="z-50 fixed flex items-center justify-center h-8 top-0 left-0 w-full bg-blue-500 dark:bg-blue-900 text-white">
      <Link href="/api/exit-preview">
        <a className="text-xs hover:underline">
          Preview mode enabled. Click here to exit.
        </a>
      </Link>
    </div>
  );
}
