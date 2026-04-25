export interface PresenceUser {
  clientId: number;
  userId: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
}

export interface CursorPosition {
  anchor: number;
  head: number;
}
