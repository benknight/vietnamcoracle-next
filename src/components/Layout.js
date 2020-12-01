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
      <div className="flex-auto" style={{ position: 'sticky', bottom: 0 }}>
        {children}
      </div>
    </div>
  </div>
);

export default Layout;
