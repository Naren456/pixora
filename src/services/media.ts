import * as MediaLibrary from "expo-media-library";

export type DeviceAsset = MediaLibrary.Asset & {
  isVideo: boolean;
};

export type DeviceMediaResponse = {
  assets: DeviceAsset[];
  endCursor?: string;
  hasNextPage: boolean;
};

export const getDeviceMedia = async (
  first = 100,
  after?: string,
): Promise<DeviceMediaResponse> => {
  const mediaType = [
    MediaLibrary.MediaType.photo,
    MediaLibrary.MediaType.video,
  ];
  const result = await MediaLibrary.getAssetsAsync({
    first,
    after,
    mediaType,
    sortBy: [MediaLibrary.SortBy.creationTime],
  });

  return {
    assets: result.assets.map((asset) => ({
      ...asset,
      isVideo: asset.mediaType === MediaLibrary.MediaType.video,
    })) as DeviceAsset[],
    endCursor: result.endCursor,
    hasNextPage: result.hasNextPage,
  };
};
