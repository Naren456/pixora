import { getDbConnection } from "./sqlite";
export interface TimelineGroup {
  date: string;
  data: string; // JSON string containing an array of photo objects
}

/**
 * Fetches all photos grouped chronologically by date using database native engines.
 * This satisfies the "Database-First Aggregation" engineering constraint.
 */
export async function fetchTimelineAggregated(): Promise<TimelineGroup[]> {
  const db = await getDbConnection();

  // Aggregate directly in SQLite using json_group_array & json_object
  const query = `
    SELECT 
      strftime('%Y-%m-%d', creationTime / 1000, 'unixepoch', 'localtime') as date,
      json_group_array(
        json_object(
          'id', id,
          'uri', uri,
          'filename', filename,
          'width', width,
          'height', height,
          'creationTime', creationTime
        )
      ) as data
    FROM photos
    GROUP BY date
    ORDER BY creationTime DESC;
  `;

  const result = await db.getAllAsync<TimelineGroup>(query);
  return result;
}

/**
 * Inserts or ignores media batches to prevent duplicates.
 * This satisfies the Data Stream Engine constraint for atomic operations.
 */
export async function batchInsertPhotos(photos: any[]): Promise<void> {
  const db = await getDbConnection();
  
  if (photos.length === 0) return;

  // Compile atomic batch transaction writes
  await db.withTransactionAsync(async () => {
    const statement = await db.prepareAsync(`
      INSERT OR IGNORE INTO photos (id, uri, filename, mediaType, width, height, creationTime, duration, lastIndexedAt)
      VALUES ($id, $uri, $filename, $mediaType, $width, $height, $creationTime, $duration, $lastIndexedAt);
    `);

    try {
      for (const photo of photos) {
        await statement.executeAsync({
          $id: photo.id,
          $uri: photo.uri,
          $filename: photo.filename,
          $mediaType: photo.mediaType,
          $width: photo.width,
          $height: photo.height,
          $creationTime: photo.creationTime,
          $duration: photo.duration || 0,
          $lastIndexedAt: 0 // Will be set once Agent Gamma computes embeddings
        });
      }
    } finally {
      await statement.finalizeAsync();
    }
  });
}

export interface PhotoDetailRecord {
  id: string;
  uri: string;
  filename: string;
  mediaType: string;
  width: number;
  height: number;
  creationTime: number;
  duration: number;
  embedding: string | null;
}

/**
 * Fetches target photo metadata records directly from the database engine cache.
 */
/**
 * Fetches target photo metadata records directly from the database engine cache.
 */
export async function fetchPhotoDetailById(id: string): Promise<PhotoDetailRecord | null> {
  const db = await getDbConnection();
  const query = 'SELECT id, uri, filename, mediaType, width, height, creationTime, duration, embedding FROM photos WHERE id = ?;';
  
  // CRITICAL: Ensure [id] is explicitly passed as an array to map to the '?' placeholder
  return await db.getFirstAsync<PhotoDetailRecord>(query, [id]);
}