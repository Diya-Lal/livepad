import { memo } from 'react';

interface Props {
  name: string;
  color: string;
}

export const CollaboratorAvatar = memo(function CollaboratorAvatar({ name, color }: Props) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      title={name}
      style={{ backgroundColor: color }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white dark:ring-gray-800 shrink-0"
    >
      {initials}
    </div>
  );
});
