import { memo } from 'react';

interface Props {
  name: string;
  color: string;
}

export const PresenceCursor = memo(function PresenceCursor({ name, color }: Props) {
  return (
    <span
      style={{ borderColor: color }}
      className="relative border-l-2 ml-px"
    >
      <span
        style={{ backgroundColor: color }}
        className="absolute -top-5 left-0 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap pointer-events-none"
      >
        {name}
      </span>
    </span>
  );
});
