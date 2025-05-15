import { draftMode } from 'next/headers';
import Header from '../../components/Header';
import Layout, { LayoutMain } from '../../components/Layout';

interface Props {
  children: React.ReactNode;
}

export default async function SearchLayout({ children }: Props) {
  const { isEnabled: preview } = await draftMode();

  return (
    <>
      <Header preview={preview} />
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
