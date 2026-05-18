import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PhotoFolder } from "../services/mediaLibrary";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_SIZE = (width - 48) / COLUMN_COUNT;

interface FolderGridProps {
  folders: PhotoFolder[];
  onSelectFolder: (folder: PhotoFolder) => void;
}

export default function FolderGrid({ folders, onSelectFolder }: FolderGridProps) {
  console.log("[Pixora][FolderGrid] render folders:", folders.length);

  const renderItem = ({ item }: { item: PhotoFolder }) => (
    <TouchableOpacity style={styles.folderCard} onPress={() => onSelectFolder(item)} activeOpacity={0.78}>
      <View style={styles.folderPreview}>
        <Ionicons name="folder-outline" size={36} color="#d7d7dc" />
      </View>
      <Text style={styles.folderTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.folderCount}>{item.assetCount} photos</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={folders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: "#0b0b0d",
  },
  folderCard: {
    width: ITEM_SIZE,
    marginHorizontal: 8,
    marginBottom: 22,
  },
  folderPreview: {
    width: "100%",
    height: ITEM_SIZE * 0.75,
    borderRadius: 8,
    backgroundColor: "#17171b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  folderTitle: {
    color: "#f3f3f4",
    fontSize: 15,
    fontWeight: "700",
  },
  folderCount: {
    color: "#8d8d95",
    fontSize: 13,
    marginTop: 2,
  },
});
