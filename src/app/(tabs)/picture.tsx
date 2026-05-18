import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchAllLocalPhotos, LocalPhoto } from "../../services/mediaLibrary";
import {
  getCachedPhotos,
  isPhotoIndexFresh,
  replaceCachedPhotos,
} from "../../services/photoIndexDb";
import { groupPhotosByDate, PhotoSection } from "../../utils/dataGrouper";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 4;
const PADDING = 12;
const GAP = 3;
const IMAGE_SIZE = (width - PADDING * 2 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

export default function PictureScreen() {
  const [sections, setSections] = useState<PhotoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Pixora][screen] Pictures mounted");
    loadPictures();
  }, []);

  async function loadPictures() {
    try {
      console.log("[Pixora][pictures] load start");
      setLoading(true);
      setError(null);
      const cachedPhotos = await getCachedPhotos();

      if (cachedPhotos.length > 0) {
        console.log("[Pixora][pictures] using cached photos:", cachedPhotos.length);
        setSections(groupPhotosByDate(cachedPhotos));
        setLoading(false);
      }

      const fresh = await isPhotoIndexFresh();
      if (fresh && cachedPhotos.length > 0) {
        console.log("[Pixora][pictures] cache is fresh; skipping MediaLibrary scan");
        return;
      }

      await refreshPhotoIndex();
    } catch (err: unknown) {
      console.log("[Pixora][pictures] load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load photos");
    } finally {
      console.log("[Pixora][pictures] load finished");
      setLoading(false);
    }
  }

  async function refreshPhotoIndex() {
    try {
      console.log("[Pixora][pictures] index refresh start");
      setIndexing(true);
      const photos = await fetchAllLocalPhotos();
      console.log("[Pixora][pictures] fetched total photos:", photos.length);
      await replaceCachedPhotos(photos);
      const grouped = groupPhotosByDate(photos);
      console.log("[Pixora][pictures] grouped sections:", grouped.length);
      setSections(grouped);
    } finally {
      console.log("[Pixora][pictures] index refresh finished");
      setIndexing(false);
    }
  }

  const chunkSectionData = (data: LocalPhoto[]): LocalPhoto[][] => {
    const chunks: LocalPhoto[][] = [];
    for (let i = 0; i < data.length; i += COLUMN_COUNT) {
      chunks.push(data.slice(i, i + COLUMN_COUNT));
    }
    console.log("[Pixora][pictures] chunk section:", { photoCount: data.length, rowCount: chunks.length });
    return chunks;
  };

  const renderSectionRow = ({ item }: { item: LocalPhoto[] }) => (
    <View style={styles.row}>
      {item.map((photo) => (
        <TouchableOpacity key={photo.id} activeOpacity={0.88} style={styles.imageWrapper}>
          <Image source={{ uri: photo.uri }} style={styles.image} contentFit="cover" transition={120} />
        </TouchableOpacity>
      ))}
      {item.length < COLUMN_COUNT &&
        Array.from({ length: COLUMN_COUNT - item.length }).map((_, index) => (
          <View key={`filler-${index}`} style={styles.imageWrapper} />
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0b0b0d" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pictures</Text>
          {indexing && <Text style={styles.indexingText}>Updating index</Text>}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="search" size={23} color="#f3f3f4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="ellipsis-vertical" size={23} color="#f3f3f4" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.stateText}>Loading photos</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPictures} activeOpacity={0.82}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections.map((section) => ({ ...section, data: chunkSectionData(section.data) }))}
          keyExtractor={(item, index) => `picture-row-${index}-${item.map((photo) => photo.id).join("-")}`}
          renderItem={renderSectionRow}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b0b0d",
  },
  header: {
    minHeight: 118,
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    color: "#f3f3f4",
    fontSize: 34,
    fontWeight: "700",
  },
  indexingText: {
    color: "#8d8d95",
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 18,
  },
  sectionHeader: {
    backgroundColor: "#0b0b0d",
    paddingHorizontal: PADDING,
    paddingTop: 16,
    paddingBottom: 9,
  },
  sectionTitle: {
    color: "#d7d7dc",
    fontSize: 15,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    columnGap: GAP,
    marginBottom: GAP,
    paddingHorizontal: PADDING,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: "#17171b",
  },
  image: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  stateText: {
    color: "#8d8d95",
    fontSize: 13,
    marginTop: 12,
  },
  errorText: {
    color: "#ffb4ab",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: "#f3f3f4",
    justifyContent: "center",
  },
  retryText: {
    color: "#0b0b0d",
    fontWeight: "700",
  },
});
