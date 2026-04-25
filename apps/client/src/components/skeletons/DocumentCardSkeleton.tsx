export function DocumentCardSkeleton() {
  return (
    <div className="animate-pulse p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}
