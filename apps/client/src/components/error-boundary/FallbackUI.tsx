interface Props {
  error: Error | null;
  onReset: () => void;
}

export function FallbackUI({ error, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-center p-8">
      <p className="text-lg font-medium text-gray-900 dark:text-white">Something went wrong</p>
      {error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{error.message}</p>
      )}
      <button
        onClick={onReset}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
