import cx from 'classnames';

const Layout = ({ children, className = '' }) => (
  <div className={cx('mx-auto xl:flex', className)}>{children}</div>
);

export const LayoutMain = ({ children, className = '' }) => (
  <main
    className={cx(
      className,
      'overflow-hidden xl:w-[70%] 2xl:w-auto 2xl:flex-auto',
    )}>
    {children}
  </main>
);

export const LayoutSidebar = ({
  children = null,
  className = '',
  showBorder = false,
}) => {
  return (
    <div
      className={cx(
        className,
        'xl:w-[30%] 2xl:w-[32rem] xl:flex xl:flex-col flex-shrink-0',
        showBorder &&
          'relative xl:border-l border-gray-200 dark:border-gray-800',
      )}>
      {showBorder && (
        <div className="hidden xl:block absolute top-0 -left-px w-px h-48 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
      )}
      {children}
    </div>
  );
};

export default Layout;
