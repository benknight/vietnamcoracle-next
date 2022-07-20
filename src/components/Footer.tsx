import Link from 'next/link';
import useAPI from '../lib/useAPI';
// @ts-ignore
import LonelyPlanetLogo from '../../public/lp-logo.svg';

export default function Footer() {
  const { data } = useAPI('/api/footer');
  if (!data) return null;
  return (
    <footer>
      <div className="block lg:pt-8 pb-16 mx-auto text-center">
        <div className="font-display text-xxs tracking-widest opacity-75">
          Recommended by
        </div>
        <a
          className="inline-block relative my-4 text-lp-blue dark:text-gray-500"
          href="https://www.lonelyplanet.com/vietnam/a/nar-gr/planning-tips/357846"
          target="_blank"
          rel="nofollow noopener">
          <LonelyPlanetLogo
            className="mx-auto w-auto h-20"
            viewBox="0 0 400 198"
          />
        </a>
        <div className="md:max-w-lg mx-auto px-8 xs:px-16 text-base md:text-xl lg:text-base font-display italic text-gray-500 dark:text-gray-200">
          “Excellent independent travel advice from a long-term resident”
        </div>
      </div>
      <section className="px-2 pb-12 lg:px-0">
        <ul className="flex flex-wrap justify-center uppercase text-xxxs tracking-widest">
          {data.menu?.menuItems?.nodes.map(item => (
            <Link key={item.path} href={item.path}>
              <a className="mx-2 my-3 xs:mx-3 lg:mx-3 opacity-75 hover:opacity-100">
                {item.label}
              </a>
            </Link>
          ))}
        </ul>
      </section>
    </footer>
  );
}
