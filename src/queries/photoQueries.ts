import { getDatabase } from '../db/client';
import { PhotoRecord } from '../db/schema';

/**
 * 📥 Safely inserts a newly discovered photo reference into the local cache.
 * Uses INSERT OR IGNORE to automatically bypass duplicate entries.
 */
export const insertPhotoRecord = async (
  id: string,
  uri: string,
  filename: string,
  timestamp: number
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO photos (id, uri, filename, timestamp) VALUES (?, ?, ?, ?)`,
    [id, uri, filename, timestamp]
  );
};

/**
 * 📸 Pulls all cached photos sorted chronologically for Google Photos style streaming.
 */
export const fetchAllPhotosChronological = async (): Promise<PhotoRecord[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<PhotoRecord>(
    `SELECT * FROM photos ORDER BY timestamp DESC`
  );
};

/**
 * 🧠 Pulls only the photo rows that have not yet been processed by our CLIP AI engine.
 */
export const fetchPendingAIPhotos = async (limit: number = 50): Promise<PhotoRecord[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<PhotoRecord>(
    `SELECT * FROM photos WHERE vector_embedded = 0 LIMIT ?`,
    [limit]
  );
};

/**
 * ⚡ Updates a photo's status flag once it has been successfully analyzed.
 */
export const markPhotoAsEmbedded = async (id: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE photos SET vector_embedded = 1 WHERE id = ?`,
    [id]
  );
};