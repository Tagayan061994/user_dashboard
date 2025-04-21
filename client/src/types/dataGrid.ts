import { ReactNode } from 'react';

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

export interface Cell {
  type: CellType;
  value: any;
  editable?: boolean;
}

// Cell definition for different types
export interface TextCell extends Cell {
  type: CellType.TEXT;
  value: string;
}

export interface NumberCell extends Cell {
  type: CellType.NUMBER;
  value: number;
}

export interface DateCell extends Cell {
  type: CellType.DATE;
  value: string | Date;
}

export interface TagCell extends Cell {
  type: CellType.TAG;
  value: string;
}

export interface LinkCell extends Cell {
  type: CellType.LINK;
  value: string;
  href: string;
}

export interface UserCell extends Cell {
  type: CellType.USER;
  value: User;
}

export interface MultiUserCell extends Cell {
  type: CellType.MULTI_USER;
  value: User[];
}

export type CellData = TextCell | NumberCell | DateCell | TagCell | LinkCell | UserCell | MultiUserCell;

export interface Column {
  id: string;
  title: string;
  type: CellType;
  width?: number | string;
  editable?: boolean;
  sortable?: boolean;
  resizable?: boolean;
}

export interface Row {
  id: string;
  cells: Record<string, CellData>;
}

export interface GridData {
  columns: Column[];
  rows: Row[];
}

export interface CellRenderer {
  render: (cell: CellData, column: Column, onEdit: (value: any) => void) => ReactNode;
}

export interface CellEditor {
  edit: (cell: CellData, column: Column, onSave: (value: any) => void, onCancel: () => void) => ReactNode;
}

export interface PluginRegistry {
  registerRenderer: (type: CellType, renderer: CellRenderer) => void;
  registerEditor: (type: CellType, editor: CellEditor) => void;
  getRenderer: (type: CellType) => CellRenderer | undefined;
  getEditor: (type: CellType) => CellEditor | undefined;
}
