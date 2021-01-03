const Layout = ({ children }) => <div className="lg:flex">{children}</div>;

export const LayoutMain = ({ children }) => (
  <div className="lg:w-2/3">{children}</div>
);

export const LayoutSidebar = ({ children }) => (
  <div className="lg:w-1/3">
    <div
      className="
        lg:h-full lg:px-6 py-12 lg:pb-0
        lg:flex lg:items-end">
      <div className="sticky bottom-0 flex-auto">{children}</div>
    </div>
  </div>
);

export default Layout;
