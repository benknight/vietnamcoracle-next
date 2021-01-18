import cx from 'classnames';
import { useRouter } from 'next/router';

const Layout = ({ children }) => (
  <div className="mx-auto lg:flex max-w-screen-2xl bg-white dark:bg-gray-900">
    {children}
  </div>
);

export const LayoutMain = ({ children }) => (
  <div className="lg:w-2/3">{children}</div>
);

export const LayoutSidebar = ({ children }) => {
  const router = useRouter();
  return (
    <div
      className={cx('lg:w-1/3', {
        // 'bg-gray-100 dark:bg-gray-950':
        // router.pathname !== '/browse/[[...browse]]',
      })}>
      <div
        className="
        lg:h-full lg:px-6 py-12 lg:pb-0
        lg:flex lg:items-end">
        <div className="sticky bottom-0 flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
