import cx from 'classnames';

type screenSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface LayoutProps {
  children: JSX.Element[] | JSX.Element;
  maxWidth?: screenSize;
}

const Layout = ({ children, maxWidth = '2xl' }: LayoutProps) => (
  <div
    className={`mx-auto xl:flex max-w-screen-${maxWidth} bg-white dark:bg-gray-950 pb-14 xl:pb-0`}>
    {children}
  </div>
);

export const LayoutMain = ({ children }) => (
  <main className="overflow-hidden xl:w-2/3">{children}</main>
);

export const LayoutSidebar = ({ className = '', children }) => {
  return (
    <div className={cx(className, 'xl:w-1/3 xl:flex xl:flex-col')}>
      {children}
    </div>
  );
};

export default Layout;
