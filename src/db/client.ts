import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * ⚡ Opens or retrieves the active local database connection
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('pixora_gallery.db');
  }
  return dbInstance;
};