import { getDatabase } from './client';

/**
 * 🛠️ Initializes core table schemas and optimized indexes
 */
export const initDatabaseSchema = async () => {
  const db = await getDatabase();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY NOT NULL,
      uri TEXT NOT NULL,
      filename TEXT,
      timestamp INTEGER NOT NULL,
      vector_embedded INTEGER DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_photos_timestamp ON photos (timestamp DESC);
  `);
};

/**
 * 📝 TypeScript type contract for a standardized photo record
 */
export interface PhotoRecord {
  id: string;
  uri: string;
  filename: string;
  timestamp: number;
  vector_embedded: number; // 0 = Pending AI Scan, 1 = Scanned & Synced
}