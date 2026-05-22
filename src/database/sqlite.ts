import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'pixora.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  // If the initialization is already running, return the existing promise
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);

      // Enable WAL mode for high performance background synchronization writes
      await dbInstance.execAsync('PRAGMA journal_mode = WAL;');

      // Create operational schemas sequentially
      await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS photos (
          id TEXT PRIMARY KEY NOT NULL,
          uri TEXT NOT NULL,
          filename TEXT NOT NULL,
          mediaType TEXT NOT NULL,
          width INTEGER NOT NULL,
          height INTEGER NOT NULL,
          creationTime INTEGER NOT NULL,
          duration REAL DEFAULT 0,
          lastIndexedAt INTEGER DEFAULT 0,
          embedding TEXT
        );

        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          createdAt INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS collection_photos (
          collectionId TEXT NOT NULL,
          photoId TEXT NOT NULL,
          PRIMARY KEY (collectionId, photoId),
          FOREIGN KEY (collectionId) REFERENCES collections (id) ON DELETE CASCADE,
          FOREIGN KEY (photoId) REFERENCES photos (id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_photos_creationTime ON photos(creationTime);
        CREATE INDEX IF NOT EXISTS idx_photos_lastIndexedAt ON photos(lastIndexedAt);
      `);
    }
    return dbInstance;
  })();

  return initPromise;
}

/**
 * Protects against NullPointerExceptions by forcing all callers
 * to wait for the initialization promise to finish.
 */
export async function getDbConnection(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return await initPromise;
  
  // Fallback if called before initializeDatabase() was invoked
  return await initializeDatabase();
}