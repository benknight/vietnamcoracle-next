import { draftMode } from 'next/headers';
import Header from '../../components/Header';
import Layout, { LayoutMain, LayoutSidebar } from '../../components/Layout';
import SidebarDefault from '../../components/SidebarDefault';
import getGQLClient from '../../lib/getGQLClient';
import SidebarQuery from '../../queries/Sidebar.gql';
import Footer from '../../components/Footer';

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: preview } = await draftMode();
  const api = getGQLClient(preview ? 'preview' : 'admin');
  const blockData = await api.request(SidebarQuery);

  return (
    <>
      <Header preview={preview} />
      <div className="bg-gray-100 dark:bg-transparent">
        <Layout className="max-w-screen-2xl pb-14 xl:pb-0 bg-white dark:bg-transparent">
          <LayoutMain className="min-h-screen bg-gray-100 dark:bg-black lg:bg-transparent">
            <div className="px-2 lg:px-8 pb-8">{children}</div>
          </LayoutMain>
          <LayoutSidebar>
            <SidebarDefault blocks={blockData} className="xl:!pt-16" />
            <Footer />
          </LayoutSidebar>
        </Layout>
      </div>
    </>
  );
}
