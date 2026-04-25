import { z } from 'zod';

export const roleSchema = z.enum(['OWNER', 'EDITOR', 'COMMENTER', 'VIEWER']);

export const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: roleSchema.exclude(['OWNER']),
});

export const updatePermissionSchema = z.object({
  role: roleSchema.exclude(['OWNER']),
});

export type Role = z.infer<typeof roleSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
