import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'pixora.db';

export async function initializeDatabase(): Promise<void> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Enable WAL mode for faster background write performance during media mining
  await db.execAsync('PRAGMA journal_mode = WAL;');

  // Create tables sequentially
  await db.execAsync(`
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
      embedding TEXT -- Stringified JSON array holding raw float32 embeddings
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

export async function getDbConnection() {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
}