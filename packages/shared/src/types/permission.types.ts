import type { Role } from '../schemas/permission.schema.js';

export type { Role };

export interface Permission {
  id: string;
  userId: string;
  documentId: string;
  role: Role;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}
