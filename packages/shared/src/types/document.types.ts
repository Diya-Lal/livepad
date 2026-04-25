export interface Document {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentWithPermission extends Document {
  role: 'OWNER' | 'EDITOR' | 'COMMENTER' | 'VIEWER';
}
