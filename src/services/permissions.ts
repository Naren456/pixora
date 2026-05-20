import * as MediaLibrary from "expo-media-library";

export const requestMediaLibraryPermissions = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === MediaLibrary.PermissionStatus.GRANTED;
};

export const getMediaLibraryPermissions = async () => {
  const { status } = await MediaLibrary.getPermissionsAsync();
  return status === MediaLibrary.PermissionStatus.GRANTED;
};
