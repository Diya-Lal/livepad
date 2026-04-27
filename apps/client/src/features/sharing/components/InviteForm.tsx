import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteSchema, type InviteInput } from '@livepad/shared';
import { PermissionSelect } from './PermissionSelect';

interface Props {
  onInvite: (input: InviteInput) => Promise<void>;
}

export function InviteForm({ onInvite }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'VIEWER' },
  });

  const role = watch('role');

  const onSubmit = async (data: InviteInput) => {
    await onInvite(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="flex-1">
        <input
          type="email"
          placeholder="Email address"
          {...register('email')}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <PermissionSelect
        value={role as Exclude<typeof role, 'OWNER'>}
        onChange={val => setValue('role', val)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Invite
      </button>
    </form>
  );
}
