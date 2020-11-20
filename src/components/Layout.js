import Header from './Header';
import Nav from './Nav';

const Layout = props => {
  return (
    <>
      <Header />
      <Nav />
      {props.children}
    </>
  );
};

export default Layout;
