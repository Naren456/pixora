import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FolderGrid from "../../components/FolderGrid";
import { fetchPhotoFolders, PhotoFolder } from "../../services/mediaLibrary";

export default function AlbumsScreen() {
  const [folders, setFolders] = useState<PhotoFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Pixora][screen] Albums mounted");
    loadAlbums();
  }, []);

  async function loadAlbums() {
    try {
      console.log("[Pixora][albums] screen load start");
      setLoading(true);
      setError(null);
      const fetchedFolders = await fetchPhotoFolders();
      console.log("[Pixora][albums] screen fetched folders:", fetchedFolders.length);
      setFolders(fetchedFolders);
    } catch (err: unknown) {
      console.log("[Pixora][albums] screen load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load albums");
    } finally {
      console.log("[Pixora][albums] screen load finished");
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0b0b0d" />
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#f3f3f4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="search" size={23} color="#f3f3f4" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.stateText}>Loading albums</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAlbums} activeOpacity={0.82}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FolderGrid folders={folders} onSelectFolder={(folder) => console.log("Open album:", folder.id)} />
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
