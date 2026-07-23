// src/pipelines/cameraRollPipe.ts
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { insertPhotoRecord } from '../queries/photoQueries';

/**
 * 🚀 Scans local hardware for media items and streams them into our SQLite cache layer.
 */
export const syncLocalCameraRollWithDB = async (batchSize: number = 100): Promise<void> => {
  try {
    let hasNextPage = true;
    let endCursor: string | undefined = undefined;

    while (hasNextPage) {
      const params: any = {
        first: batchSize,
        assetType: 'Photos',
        // Sort chronologically from modern to old
        sortBy: 'creationTime',
      };

      if (endCursor) {
        params.after = endCursor;
      }

      const pageInfo = await CameraRoll.getPhotos(params);
      
      // Batch insertion into SQLite database
      const promises = pageInfo.edges.map((edge) => {
        const { node } = edge;
        // Constructing standard PhotoRecord parameters
        const id = node.image.uri; // Using URI or a unique combination as standard asset identifier
        const uri = node.image.uri;
        const filename = node.image.filename || `IMG_${node.timestamp}.jpg`;
        const timestamp = node.timestamp * 1000; // Standardize to millisecond UNIX epoch

        return insertPhotoRecord(id, uri, filename, timestamp);
      });

      await Promise.all(promises);

      hasNextPage = pageInfo.page_info.has_next_page;
      endCursor = pageInfo.page_info.end_cursor;
    }
  } catch (error) {
    console.error('❌ Failed to run camera roll synchronization pipe:', error);
    throw error;
  }
};