import { DeviceAsset, DeviceMediaResponse, getDeviceMedia } from "./media";

export const fetchImages = async (
  first = 100,
  after?: string,
): Promise<DeviceMediaResponse> => {
  return getDeviceMedia(first, after);
};

export type { DeviceAsset, DeviceMediaResponse };
