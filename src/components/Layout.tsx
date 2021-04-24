import cx from 'classnames';

const Layout = ({ children, className = '' }) => (
  <div
    className={cx(
      'mx-auto xl:flex bg-white dark:bg-gray-950 pb-14 xl:pb-0',
      className,
    )}>
    {children}
  </div>
);

export const LayoutMain = ({ children }) => (
  <main className="overflow-hidden xl:w-2/3 2xl:w-auto 2xl:flex-auto">
    {children}
  </main>
);

export const LayoutSidebar = ({ children, className = '' }) => {
  return (
    <div
      className={cx(
        className,
        'xl:w-1/3 2xl:w-[32rem] xl:flex xl:flex-col flex-shrink-0',
      )}>
      {children}
    </div>
  );
};

export default Layout;
