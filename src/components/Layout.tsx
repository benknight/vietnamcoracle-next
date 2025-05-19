import cx from 'classnames';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: Props) => (
  <div className={cx('mx-auto xl:flex', className)}>{children}</div>
);

export const LayoutMain = ({ children, className = '' }: Props) => (
  <div className={cx(className, 'xl:w-[70%] 2xl:w-auto 2xl:flex-auto')}>
    {children}
  </div>
);

export const LayoutSidebar = ({
  children,
  className = '',
  showBorder = true,
}: Props & { showBorder?: boolean }) => (
  <div
    className={cx(
      className,
      'xl:w-[30%] 2xl:w-[32rem] xl:flex xl:flex-col shrink-0',
      showBorder && 'relative xl:border-l border-gray-200 dark:border-gray-800',
    )}>
    {showBorder && (
      <div className="hidden xl:block absolute top-0 -left-px w-px h-48 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
    )}
    {children}
  </div>
);

export default Layout;
