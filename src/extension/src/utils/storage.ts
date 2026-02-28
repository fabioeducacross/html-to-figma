import type { CaptureData } from './exportJson';

const DB_NAME = 'html2figma';
const STORE_NAME = 'captures';
const MAX_CAPTURES = 10;

/** Opens (or creates) the IndexedDB database. */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a capture to IndexedDB, enforcing the maximum capture limit.
 *
 * @param capture - The capture data to persist.
 */
export async function saveCapture(capture: CaptureData): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  // Enforce limit: remove oldest entries if needed
  const all = await new Promise<CaptureData[]>((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as CaptureData[]);
    req.onerror = () => reject(req.error);
  });

  if (all.length >= MAX_CAPTURES) {
    const sorted = all.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    for (let i = 0; i <= all.length - MAX_CAPTURES; i++) {
      store.delete(sorted[i].id);
    }
  }

  store.put(capture);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieves all captures from IndexedDB, sorted by timestamp descending.
 *
 * @returns An array of capture data objects.
 */
export async function listCaptures(): Promise<CaptureData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () =>
      resolve(
        (req.result as CaptureData[]).sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      );
    req.onerror = () => reject(req.error);
  });
}

/**
 * Deletes a capture by its ID.
 *
 * @param id - The ID of the capture to delete.
 */
export async function deleteCapture(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
