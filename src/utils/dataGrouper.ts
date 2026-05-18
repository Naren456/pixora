import { LocalPhoto } from "../services/mediaLibrary";

export interface PhotoSection {
  title: string;
  data: LocalPhoto[];
}

export function groupPhotosByDate(photos: LocalPhoto[]): PhotoSection[] {
  console.log('[Pixora][grouping] grouping photos by date:', photos.length);
  const groups: Record<string, LocalPhoto[]> = {};

  photos.forEach((photo) => {
    const timestamp =
      photo.creationTime < 1000000000000
        ? photo.creationTime * 1000
        : photo.creationTime;
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(photo);
  });

  const sections = Object.entries(groups).map(([title, data]) => ({ title, data }));
  console.log(
    '[Pixora][grouping] sections:',
    sections.length,
    sections.map((section) => `${section.title}(${section.data.length})`)
  );
  return sections;
}
