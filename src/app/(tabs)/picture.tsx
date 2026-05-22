import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { usePixoraEngine } from "@/store/useStore";
import GalleryRow, { ROW_ITEM_SIZE } from "@/components/GalleryRow";

export default function PicturesScreen() {
  const { syncState, timeline, startMediaSync } = usePixoraEngine();

  // Initialize media scraping on hardware mount
  useEffect(() => {
    startMediaSync();
  }, [startMediaSync]);

  // Satisfy Thread Isolation: Chunk data structures completely out of the render pipeline loop
  const preparedListRows = useMemo(() => {
    const dataRows: any[] = [];

    timeline.forEach((group) => {
      // Inject Sticky Section Headers
      dataRows.push({
        type: "HEADER",
        id: `header-${group.date}`,
        title: group.date,
      });

      const photosArray = JSON.parse(group.data);
      // Bundle photos down into groups of triplets
      for (let i = 0; i < photosArray.length; i += 3) {
        dataRows.push({
          type: "ROW",
          id: `row-${group.date}-${i}`,
          items: photosArray.slice(i, i + 3),
        });
      }
    });

    return dataRows;
  }, [timeline]);

  const handlePhotoInspect = (photo: any) => {
    console.log("Open photo canvas layout module for instance id:", photo.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.statusBarHeader}>
        <Text style={styles.logoTitle}>Pixora</Text>
        {syncState.isSyncing && (
          <View style={styles.syncBadge}>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.syncText}>
              Cataloging {syncState.scannedCount}...
            </Text>
          </View>
        )}
      </View>

      {preparedListRows.length === 0 ? (
        <View style={styles.loaderBox}>
          {syncState.isSyncing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.emptyLabel}>
              {syncState.error
                ? `Error: ${syncState.error}`
                : "No device media discovered."}
            </Text>
          )}
        </View>
      ) : (
        <FlashList<any>
          data={preparedListRows}
          keyExtractor={(item) => item.id}
          estimatedItemSize={ROW_ITEM_SIZE}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            if (item.type === "HEADER") {
              return (
                <View style={styles.headerSection}>
                  <Text style={styles.headerSectionText}>{item.title}</Text>
                </View>
              );
            }
            return (
              <GalleryRow items={item.items} onItemPress={handlePhotoInspect} />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  statusBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1c1c1e",
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  syncText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "600",
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyLabel: {
    color: "#555",
    fontSize: 14,
  },
  headerSection: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSectionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
