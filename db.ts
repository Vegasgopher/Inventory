
import { InventoryData, InventoryItem, ItemLocation, AuditLog, AuditType } from '../types';

const STORAGE_KEY = 'sbs_cordova_inventory_data';

const DEFAULT_DATA: InventoryData = {
  items: [],
  locations: [],
  auditLogs: [],
  categories: ['FISH MEAL/OIL', 'PLT', 'FROZENPOLY', 'MISC', 'CANNERY', 'FRESH', 'VACPAC', 'TOTE', 'SALT'],
  masterLocations: ['MAIN-WH', 'COLD-STORAGE', 'DOCK-1', 'DOCK-2', 'PLANT-A']
};

export const getDB = (): InventoryData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_DATA;
  try {
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      categories: parsed.categories || DEFAULT_DATA.categories,
      masterLocations: parsed.masterLocations || DEFAULT_DATA.masterLocations,
    };
  } catch {
    return DEFAULT_DATA;
  }
};

export const saveDB = (data: InventoryData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetDB = () => {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_DATA;
};

export const createAuditEntry = (
  itemNumber: string,
  type: AuditType,
  quantity: number,
  notes: string,
  fromLocation?: string,
  toLocation?: string
): AuditLog => {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    itemNumber,
    type,
    fromLocation,
    toLocation,
    quantity,
    notes
  };
};

export const deleteInventoryItem = (id: string) => {
  const db = getDB();
  const item = db.items.find(i => i.id === id);
  if (!item) return db;

  db.items = db.items.filter(i => i.id !== id);
  db.locations = db.locations.filter(l => l.itemNumber !== item.itemNumber);
  db.auditLogs.unshift(createAuditEntry(item.itemNumber, AuditType.REMOVE, 0, 'Permanent Part Deletion'));
  
  saveDB(db);
  return db;
};

export const updateInventoryStock = (
  itemNumber: string,
  action: 'RECEIVED' | 'TRANSFER' | 'USAGE',
  params: {
    qty: number,
    location?: string,
    fromLocation?: string,
    toLocation?: string,
    notes: string
  }
) => {
  const db = getDB();
  const { qty, location, fromLocation, toLocation, notes } = params;

  if (action === 'RECEIVED' && location) {
    let locEntry = db.locations.find(l => l.itemNumber === itemNumber && l.location === location);
    if (!locEntry) {
      locEntry = { id: crypto.randomUUID(), itemNumber, location, qoh: 0 };
      db.locations.push(locEntry);
    }
    locEntry.qoh += qty;
    db.auditLogs.unshift(createAuditEntry(itemNumber, AuditType.RECEIVED, qty, notes, undefined, location));
  } 
  
  else if (action === 'USAGE' && location) {
    const locEntry = db.locations.find(l => l.itemNumber === itemNumber && l.location === location);
    if (locEntry) {
      locEntry.qoh = Math.max(0, locEntry.qoh - qty);
      db.auditLogs.unshift(createAuditEntry(itemNumber, AuditType.USAGE, qty, notes, location, undefined));
    }
  } 
  
  else if (action === 'TRANSFER' && fromLocation && toLocation) {
    const sourceLoc = db.locations.find(l => l.itemNumber === itemNumber && l.location === fromLocation);
    if (sourceLoc && sourceLoc.qoh >= qty) {
      sourceLoc.qoh -= qty;
      let targetLoc = db.locations.find(l => l.itemNumber === itemNumber && l.location === toLocation);
      if (!targetLoc) {
        targetLoc = { id: crypto.randomUUID(), itemNumber, location: toLocation, qoh: 0 };
        db.locations.push(targetLoc);
      }
      targetLoc.qoh += qty;
      db.auditLogs.unshift(createAuditEntry(itemNumber, AuditType.TRANSFER, qty, notes, fromLocation, toLocation));
    }
  }

  saveDB(db);
  return db;
};
