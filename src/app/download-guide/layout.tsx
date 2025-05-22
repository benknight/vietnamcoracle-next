import Header from '@/components/Header';
import Menu from '@/components/Menu';
import WPGraphQLClient from '@/lib/WPGraphQLClient';
import MenuQuery from '@/queries/Menu.gql';

interface Props {
  children: React.ReactNode;
}

export default async function DownloadGuideLayout({ children }: Props) {
  const api = new WPGraphQLClient('admin', {
    next: { revalidate: 60 * 60 * 1 }, // 1 hour
  });

  const menuData = await api.request(MenuQuery);

  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      <Header menu={<Menu data={menuData} fullWidth />} fullWidth />
      {children}
    </div>
  );
}
