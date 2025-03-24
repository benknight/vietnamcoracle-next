import Header from '../../components/Header';

export default function DownloadGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white dark:bg-gray-950 min-h-screen">
      <Header fullWidth />
      {children}
    </div>
  );
}
