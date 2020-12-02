import LonelyPlanetLogo from '../../public/lp-logo.svg';

const Layout = ({ children }) => <div className="lg:flex">{children}</div>;

export const LayoutMain = ({ children }) => (
  <div className="lg:w-2/3">{children}</div>
);

export const LayoutSidebar = ({ children }) => (
  <div className="lg:w-1/3 pb-12 lg:pb-0">
    <div
      className="
        lg:h-full lg:px-6 py-12 lg:pb-0
        lg:flex lg:items-end">
      <div className="sticky bottom-0 flex-auto">
        {children}
        <a
          className="block mt-24 mb-12 text-center"
          href="https://www.lonelyplanet.com/vietnam/a/nar-gr/planning-tips/357846"
          target="_blank"
          rel="nofollow noopener">
          <div className="uppercase text-xxs tracking-widest">
            Recommended by
          </div>
          <div className="relative my-4 text-lp-blue dark:text-gray-500">
            <LonelyPlanetLogo
              className="mx-auto"
              viewBox="0 0 400 198"
              width="300"
              height="75"
            />
          </div>
          <div className="px-16 text-sm font-serif italic">
            “Excellent independent travel advice from a long-term resident”
          </div>
        </a>
      </div>
    </div>
  </div>
);

export default Layout;
