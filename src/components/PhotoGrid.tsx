import React from "react";
import { 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  ActivityIndicator, 
  View, 
  TouchableOpacity 
} from "react-native";
import { Image } from "expo-image";
import { LocalPhoto } from "../services/mediaLibrary";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

interface PhotoGridProps {
  photos: LocalPhoto[];
  onEndReached: () => void;
  loadingMore: boolean;
}

export default function PhotoGrid({ photos, onEndReached, loadingMore }: PhotoGridProps) {
  const renderItem = ({ item }: { item: LocalPhoto }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.imageContainer}
      onPress={() => console.log("Selected Photo Asset ID:", item.id)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        contentFit="cover"
        transition={200} // Clean hardware fade-in for lazy-loaded assets
      />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4} // Triggers pagination when 40% from bottom edge
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 0,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    padding: 1, // High-density grid separation line
  },
  image: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});