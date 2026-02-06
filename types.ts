
export interface InventoryItem {
  id: string; // Internal UUID
  itemNumber: string;
  description: string;
  category: string;
  uom: string; // Unit of Measure
  notes: string;
}

export interface ItemLocation {
  id: string;
  itemNumber: string;
  location: string;
  qoh: number; // Quantity on Hand
}

export enum AuditType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  MOVE = 'MOVE',
  UPDATE = 'UPDATE',
  IMPORT = 'IMPORT',
  RECEIVED = 'RECEIVED',
  TRANSFER = 'TRANSFER',
  USAGE = 'USAGE'
}

export interface AuditLog {
  id: string;
  timestamp: string;
  itemNumber: string;
  type: AuditType;
  fromLocation?: string;
  toLocation?: string;
  quantity: number;
  notes: string;
}

export interface InventoryData {
  items: InventoryItem[];
  locations: ItemLocation[];
  auditLogs: AuditLog[];
  categories: string[];
  masterLocations: string[];
}
