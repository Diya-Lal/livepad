import { Router } from 'express';
import { inviteSchema, updatePermissionSchema } from '@livepad/shared';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.js';
import { listPermissions, inviteUser, updatePermission, revokePermission } from './permissions.controller.js';

export const permissionsRouter = Router({ mergeParams: true });

permissionsRouter.use(authenticate);

permissionsRouter.get('/', listPermissions);
permissionsRouter.post('/', validate(inviteSchema), inviteUser);
permissionsRouter.patch('/:permissionId', validate(updatePermissionSchema), updatePermission);
permissionsRouter.delete('/:permissionId', revokePermission);
