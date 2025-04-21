export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export enum CellType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  TAG = 'tag',
  LINK = 'link',
  USER = 'user',
  MULTI_USER = 'multi_user',
}
