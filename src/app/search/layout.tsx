import { draftMode } from 'next/headers';
import WPGraphQLClient from '@/lib/WPGraphQLClient';
import MenuQuery from '@/queries/Menu.gql';
import Header from '@/components/Header';
import Layout, { LayoutMain } from '@/components/Layout';
import Menu from '@/components/Menu';

interface Props {
  children: React.ReactNode;
}

export default async function SearchLayout({ children }: Props) {
  const { isEnabled: preview } = await draftMode();
  const api = new WPGraphQLClient('admin', {
    next: { revalidate: 60 * 60 * 1 }, // 1 hour
  });

  const menuData = await api.request(MenuQuery);

  return (
    <>
      <Header menu={<Menu data={menuData} />} preview={preview} />
      <div className="bg-gray-100 dark:bg-transparent">
        <Layout className="max-w-screen-2xl pb-14 xl:pb-0 bg-white dark:bg-transparent">
          <LayoutMain className="min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent">
            <div className="px-2 lg:px-8 pb-8">{children}</div>
          </LayoutMain>
        </Layout>
      </div>
    </>
  );
}
