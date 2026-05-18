import * as SQLite from "expo-sqlite";
import { LocalPhoto } from "./mediaLibrary";

const DB_NAME = "pixora-photo-index.db";
const PHOTO_INDEX_TTL_MS = 5 * 60 * 1000;
const LAST_INDEXED_KEY = "photos.lastIndexedAt";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return databasePromise;
}

export async function initializePhotoIndexDb() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS photo_index (
      id TEXT PRIMARY KEY NOT NULL,
      uri TEXT NOT NULL,
      creationTime INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_photo_index_creation_time
      ON photo_index (creationTime DESC);
    CREATE TABLE IF NOT EXISTS index_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
  console.log("[Pixora][db] photo index initialized");
}

export async function getCachedPhotos(): Promise<LocalPhoto[]> {
  await initializePhotoIndexDb();
  const db = await getDatabase();
  const photos = await db.getAllAsync<LocalPhoto>(
    "SELECT id, uri, creationTime FROM photo_index ORDER BY creationTime DESC"
  );
  console.log("[Pixora][db] cached photos loaded:", photos.length);
  return photos;
}

export async function replaceCachedPhotos(photos: LocalPhoto[]) {
  await initializePhotoIndexDb();
  const db = await getDatabase();
  const indexedAt = Date.now().toString();

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM photo_index");
    const statement = await db.prepareAsync(
      "INSERT OR REPLACE INTO photo_index (id, uri, creationTime) VALUES ($id, $uri, $creationTime)"
    );

    try {
      for (const photo of photos) {
        await statement.executeAsync({
          $id: photo.id,
          $uri: photo.uri,
          $creationTime: photo.creationTime,
        });
      }
    } finally {
      await statement.finalizeAsync();
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO index_meta (key, value) VALUES ($key, $value)",
      { $key: LAST_INDEXED_KEY, $value: indexedAt }
    );
  });

  console.log("[Pixora][db] cached photos replaced:", photos.length);
}

export async function getLastPhotoIndexedAt(): Promise<number | null> {
  await initializePhotoIndexDb();
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM index_meta WHERE key = $key",
    { $key: LAST_INDEXED_KEY }
  );
  const timestamp = row ? Number(row.value) : null;
  console.log("[Pixora][db] last indexed at:", timestamp);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export async function isPhotoIndexFresh() {
  const lastIndexedAt = await getLastPhotoIndexedAt();
  const fresh = lastIndexedAt !== null && Date.now() - lastIndexedAt < PHOTO_INDEX_TTL_MS;
  console.log("[Pixora][db] photo index fresh:", fresh);
  return fresh;
}
