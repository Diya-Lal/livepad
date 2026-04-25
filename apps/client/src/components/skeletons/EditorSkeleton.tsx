export function EditorSkeleton() {
  return (
    <div className="animate-pulse flex-1 p-8 max-w-3xl mx-auto w-full">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  );
}
