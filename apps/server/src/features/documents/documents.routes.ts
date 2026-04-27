import { Router } from 'express';
import { createDocumentSchema, updateDocumentSchema } from '@livepad/shared';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.js';
import { listDocuments, createDocument, updateDocument, deleteDocument } from './documents.controller.js';

export const documentsRouter = Router();

documentsRouter.use(authenticate);

documentsRouter.get('/', listDocuments);
documentsRouter.post('/', validate(createDocumentSchema), createDocument);
documentsRouter.patch('/:id', validate(updateDocumentSchema), updateDocument);
documentsRouter.delete('/:id', deleteDocument);
