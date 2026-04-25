export function PresenceListSkeleton() {
  return (
    <div className="flex items-center gap-1 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
  );
}
