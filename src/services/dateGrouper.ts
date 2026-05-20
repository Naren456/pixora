import { DeviceAsset } from "./media";

export type DateGroupedSection = {
  title: string;
  data: DeviceAsset[];
};

export const formatAssetDate = (asset: DeviceAsset): string => {
  if (!asset.creationTime) {
    return "Unknown date";
  }

  const date = new Date(asset.creationTime * 1000);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const groupAssetsByDate = (
  assets: DeviceAsset[],
): DateGroupedSection[] => {
  const groups: Record<string, DeviceAsset[]> = {};

  assets.forEach((asset) => {
    const dateLabel = formatAssetDate(asset);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(asset);
  });

  return Object.entries(groups)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([title, data]) => ({ title, data }));
};
