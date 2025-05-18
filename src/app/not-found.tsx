import Header from '../components/Header';
import Menu from '../components/Menu';
import WPGraphQLClient from '../lib/WPGraphQLClient';
import MenuQuery from '../queries/Menu.gql';
import NotFound from '../components/NotFound';

export default async function NotFoundPage() {
  const api = new WPGraphQLClient('admin', {
    next: { revalidate: 60 * 60 * 1 }, // 1 hour
  });
  const menuData = await api.request(MenuQuery);

  return (
    <>
      <Header menu={<Menu data={menuData} fullWidth />} fullWidth />
      <NotFound />
    </>
  );
}
