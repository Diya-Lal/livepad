import type { Role } from '@livepad/shared';

const ROLES: Exclude<Role, 'OWNER'>[] = ['EDITOR', 'COMMENTER', 'VIEWER'];

interface Props {
  value: Exclude<Role, 'OWNER'>;
  onChange: (role: Exclude<Role, 'OWNER'>) => void;
  disabled?: boolean;
}

export function PermissionSelect({ value, onChange, disabled }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as Exclude<Role, 'OWNER'>)}
      disabled={disabled}
      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
    >
      {ROLES.map(role => (
        <option key={role} value={role}>
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
