import * as MediaLibrary from 'expo-media-library';

export interface PhotoFolder {
  id: string;
  title: string;
  assetCount: number;
}

export interface LocalPhoto {
  id: string;
  uri: string;
  creationTime: number;
}

export async function requestGalleryPermissions(): Promise<boolean> {
  const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
  console.log('[Pixora][permissions] current status:', status, 'canAskAgain:', canAskAgain);
  if (status === 'granted') {
    console.log('[Pixora][permissions] gallery access already granted');
    return true;
  }
  if (canAskAgain) {
    const { status: requestStatus } = await MediaLibrary.requestPermissionsAsync();
    console.log('[Pixora][permissions] request result:', requestStatus);
    return requestStatus === 'granted';
  }
  console.log('[Pixora][permissions] gallery access denied and cannot ask again');
  return false;
}

/**
 * Fetches all local media folders (albums) that contain photos.
 */
export async function fetchPhotoFolders(): Promise<PhotoFolder[]> {
  console.log('[Pixora][albums] loading photo folders');
  const hasPermission = await requestGalleryPermissions();
  if (!hasPermission) throw new Error('Gallery permission is required.');

  const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
  console.log('[Pixora][albums] raw folders:', albums.length);
  
  // Filter out empty folders or non-photo containers
  const folders = albums
    .map(album => ({
      id: album.id,
      title: album.title,
      assetCount: album.assetCount,
    }))
    .filter(album => album.assetCount > 0);
  console.log('[Pixora][albums] non-empty folders:', folders.length, folders.map(folder => `${folder.title}(${folder.assetCount})`));
  return folders;
}

/**
 * Fetches photos, optionally filtered by a specific folder (album) ID.
 */
export async function fetchLocalPhotos(
  limit = 60, 
  afterId?: string,
  folderId?: string // Pass this to scope assets to a single folder
): Promise<{ photos: LocalPhoto[]; hasNextPage: boolean; endCursor?: string }> {
  console.log('[Pixora][photos] fetching page:', { limit, afterId, folderId: folderId ?? 'all-folders' });
  const hasPermission = await requestGalleryPermissions();
  if (!hasPermission) throw new Error('Gallery permission is required.');

  const assetsResult = await MediaLibrary.getAssetsAsync({
    first: limit,
    after: afterId,
    mediaType: ['photo'],
    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    album: folderId, // Handles filtering natively
  });

  const photos = assetsResult.assets.map((asset) => ({
    id: asset.id,
    uri: asset.uri,
    creationTime: asset.creationTime,
  }));
  console.log('[Pixora][photos] page result:', {
    count: photos.length,
    hasNextPage: assetsResult.hasNextPage,
    endCursor: assetsResult.endCursor,
    firstPhoto: photos[0]?.id,
  });

  return {
    photos,
    hasNextPage: assetsResult.hasNextPage,
    endCursor: assetsResult.endCursor,
  };
}

export async function fetchAllLocalPhotos(pageSize = 250): Promise<LocalPhoto[]> {
  console.log('[Pixora][photos] fetching all local photos with page size:', pageSize);
  const allPhotos: LocalPhoto[] = [];
  let afterId: string | undefined;
  let hasNextPage = true;
  let page = 1;

  while (hasNextPage) {
    console.log('[Pixora][photos] all-pages request:', { page, afterId });
    const result = await fetchLocalPhotos(pageSize, afterId);
    allPhotos.push(...result.photos);
    console.log('[Pixora][photos] all-pages progress:', {
      page,
      pageCount: result.photos.length,
      totalCount: allPhotos.length,
    });
    hasNextPage = result.hasNextPage;
    afterId = result.endCursor;
    page += 1;

    if (!afterId) {
      console.log('[Pixora][photos] stopping pagination because endCursor is empty');
      break;
    }
  }

  console.log('[Pixora][photos] finished all local photos:', allPhotos.length);
  return allPhotos;
}
