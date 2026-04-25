import type { Role } from '../schemas/permission.schema.js';

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 4,
  EDITOR: 3,
  COMMENTER: 2,
  VIEWER: 1,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canEdit(role: Role): boolean {
  return hasPermission(role, 'EDITOR');
}

export function canComment(role: Role): boolean {
  return hasPermission(role, 'COMMENTER');
}
