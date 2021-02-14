import { gql } from 'graphql-request';
import Link from 'next/link';
// @ts-ignore
import LonelyPlanetLogo from '../../public/lp-logo.svg';

export default function Footer({ data }) {
  return (
    <footer>
      <div className="block lg:pt-4 pb-16 mx-auto text-center">
        <div className="uppercase text-xxs tracking-widest">Recommended by</div>
        <a
          className="inline-block relative my-4 text-lp-blue dark:text-gray-500"
          href="https://www.lonelyplanet.com/vietnam/a/nar-gr/planning-tips/357846"
          target="_blank"
          rel="nofollow noopener">
          <LonelyPlanetLogo
            className="mx-auto w-auto h-20 lg:h-24"
            viewBox="0 0 400 198"
          />
        </a>
        <div className="px-16 text-base md:text-lg font-display italic text-gray-500 dark:text-gray-200">
          “Excellent independent travel advice from a long-term resident”
        </div>
      </div>
      <section className="px-4 lg:px-0 pb-12">
        <ul className="flex flex-wrap justify-center uppercase text-xxs tracking-widest">
          {data.footerMenu?.menuItems?.nodes.map(item => (
            <Link key={item.path} href={item.path}>
              <a className="m-3 lg:mx-3 opacity-75 hover:opacity-100">
                {item.label}
              </a>
            </Link>
          ))}
        </ul>
      </section>
    </footer>
  );
}

Footer.fragments = gql`
  fragment FooterData on RootQuery {
    footerMenu: menu(id: "dGVybTo0MDk=") {
      menuItems {
        nodes {
          path
          label
        }
      }
    }
  }
`;
