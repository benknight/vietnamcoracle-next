export default function PostContentLoading() {
  return (
    <div className="bg-gray-100 dark:bg-black animate-pulse">
      <div className="h-64 w-full bg-gray-300 dark:bg-gray-700">
        {/* Hero placeholder */}
        <div className="max-w-screen-2xl mx-auto relative h-full">
          <div className="absolute bottom-0 translate-y-1/2 w-full">
            <div className="max-w-[52rem] mx-auto px-3 sm:px-4 md:px-8">
              <div className="h-10 bg-gray-400 dark:bg-gray-600 rounded-lg w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-screen-2xl bg-white dark:bg-gray-950 pb-14 xl:pb-0">
        <div className="grid lg:grid-cols-[1fr,20rem] xl:grid-cols-[1fr,24rem]">
          <div className="px-3 sm:px-4 md:px-8 text-lg">
            <div className="max-w-[52rem] mx-auto pt-16">
              {/* Article content placeholders */}
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="mb-6">
                    {i % 5 === 0 && (
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    )}
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-2"></div>
                    {i % 7 === 3 && (
                      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="hidden lg:block border-l border-gray-200 dark:border-gray-800">
            {/* Sidebar placeholder */}
            <div className="px-8 py-12">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-6"></div>

              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
