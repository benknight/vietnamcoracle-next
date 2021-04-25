import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();
  const emojiClassName = 'pl-4 sm:pl-16 text-4xl leading-normal text-gray-300';
  return (
    <div className="mx-auto py-12 max-w-screen-lg page-wrap font-display">
      <div className={emojiClassName}>👀…</div>
      <div className="py-4 text-center">
        <h1 className="text-3xl mb-2 text-center">Page Not Found</h1>
        Sorry, the resource requested at <em>{router.asPath}</em> was not found.
      </div>
      <div className={emojiClassName} style={{ transform: 'scaleX(-1)' }}>
        👀…
      </div>
    </div>
  );
}
