import * as MediaLibrary from 'expo-media-library';

export interface LocalAsset {
  id: string;
  uri: string;
  filename: string;
  mediaType: string;
  width: number;
  height: number;
  creationTime: number;
  duration: number;
}

/**
 * Fetches an exact page block of local media files from device hardware storage.
 * @param afterId The cursor asset ID to continue sequential extraction from.
 * @param pageSize Number of records to crawl per block.
 */
export async function fetchLocalMediaPage(
  afterId?: string,
  pageSize: number = 100
): Promise<{ assets: LocalAsset[]; hasNextPage: boolean; endCursor: string }> {
  const options: MediaLibrary.AssetsOptions = {
    first: pageSize,
    sortBy: [MediaLibrary.SortBy.creationTime],
    mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
  };

  if (afterId) {
    options.after = afterId;
  }

  const pagedInfo = await MediaLibrary.getAssetsAsync(options);

  const assets: LocalAsset[] = pagedInfo.assets.map((asset) => ({
    id: asset.id,
    uri: asset.uri,
    filename: asset.filename,
    mediaType: asset.mediaType,
    width: asset.width,
    height: asset.height,
    creationTime: asset.creationTime,
    duration: asset.duration || 0,
  }));

  return {
    assets,
    hasNextPage: pagedInfo.hasNextPage,
    endCursor: pagedInfo.endCursor,
  };
}