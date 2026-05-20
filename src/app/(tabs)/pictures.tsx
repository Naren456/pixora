import PhotoCard from "@/components/PhotoCard";
import { DateGroupedSection, groupAssetsByDate } from "@/services/dateGrouper";
import { fetchImages } from "@/services/fetchImages";
import { DeviceAsset } from "@/services/media";
import { requestMediaLibraryPermissions } from "@/services/permissions";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    SectionList,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 100;

const Pictures = () => {
  const { width } = useWindowDimensions();
  const [assets, setAssets] = useState<DeviceAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const columns = Math.max(2, Math.min(4, Math.floor(width / 92)));
  const cardSize = Math.floor((width - 24 - (columns - 1) * 8) / columns);

  const sections = useMemo<DateGroupedSection[]>(() => {
    return groupAssetsByDate(assets);
  }, [assets]);

  const loadPage = async (cursor?: string) => {
    if (loadingMore || !hasNextPage) {
      return;
    }

    setLoadingMore(true);

    try {
      const result = await fetchImages(PAGE_SIZE, cursor);
      setAssets((prev) => {
        const combined = [...prev, ...result.assets];
        const deduped = new Map<string, DeviceAsset>();
        combined.forEach((asset) => {
          deduped.set(asset.id, asset);
        });
        return Array.from(deduped.values());
      });
      setNextCursor(result.endCursor ?? null);
      setHasNextPage(result.hasNextPage);
    } catch (e) {
      console.error(e);
      setError("Unable to load local media.");
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const granted = await requestMediaLibraryPermissions();
        if (!granted) {
          setError("Permission required to load local photos and videos.");
          setLoading(false);
          return;
        }

        await loadPage();
      } catch (e) {
        console.error(e);
        setError("Unable to load local media.");
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Pictures</Text>
      {assets.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No local photos or videos found.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          stickySectionHeadersEnabled
          keyExtractor={(item: DeviceAsset) => item.id}
          renderSectionHeader={({ section }: any) => (
            <View style={styles.sectionHeaderWrapper}>
              <Text style={styles.sectionHeader}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }: { item: DeviceAsset }) => (
            <View style={{ width: cardSize, marginBottom: 8 }}>
              <PhotoCard
                title={item.filename ?? "Local media"}
                subtitle={item.isVideo ? "Video" : "Photo"}
                imageUri={item.uri}
                isVideo={item.isVideo}
                duration={item.duration}
                style={{ height: cardSize, width: cardSize }}
                imageStyle={{ height: cardSize }}
              />
            </View>
          )}
          numColumns={columns}
          columnWrapperStyle={columns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.list}
          onEndReached={() => {
            if (hasNextPage && !loadingMore) {
              loadPage(nextCursor ?? undefined);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Pictures;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  loader: {
    marginTop: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  sectionHeaderWrapper: {
    paddingHorizontal: 12,
    paddingTop: 22,
    paddingBottom: 10,
    backgroundColor: "#000",
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerLoader: {
    marginTop: 12,
    paddingBottom: 24,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
