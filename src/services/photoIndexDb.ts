import { fetchLocalMediaPage, LocalAsset } from './media';
import { batchInsertPhotos } from '@/database/queries';

export interface SyncProgress {
  scannedCount: number;
  isSyncing: boolean;
  error?: string;
}

/**
 * Iterates through system media tracks and syncs files into the SQLite architecture.
 */
export async function syncLocalMediaDatabase(
  onProgress?: (progress: SyncProgress) => void
): Promise<void> {
  let hasNextPage = true;
  let endCursor: string | undefined = undefined;
  let totalScanned = 0;

  try {
    if (onProgress) onProgress({ scannedCount: 0, isSyncing: true });

    while (hasNextPage) {
      const response = await fetchLocalMediaPage(endCursor, 100);
      const batch: LocalAsset[] = response.assets;
      
      if (batch.length === 0) {
        hasNextPage = false;
        break;
      }

      // Execute atomic transaction insert straight down to native engine
      await batchInsertPhotos(batch);

      totalScanned += batch.length;
      hasNextPage = response.hasNextPage;
      endCursor = response.endCursor;

      if (onProgress) {
        onProgress({ scannedCount: totalScanned, isSyncing: true });
      }
    }

    if (onProgress) {
      onProgress({ scannedCount: totalScanned, isSyncing: false });
    }
  } catch (error: any) {
    console.error('Data Sync Stream layer crashed:', error);
    if (onProgress) {
      onProgress({
        scannedCount: totalScanned,
        isSyncing: false,
        error: error?.message || 'Unknown Extraction Error',
      });
    }
  }
}