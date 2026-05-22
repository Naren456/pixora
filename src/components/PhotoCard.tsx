import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
// Leverage expo-image layout parameters for native thread decoding
import { Image, ImageStyle } from "expo-image";

type PhotoCardProps = {
  imageUri: string;
  isVideo?: boolean;
  duration?: number;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Enforce absolute component memoization to align with Agent Alpha constraints
const PhotoCard = React.memo(({
  imageUri,
  isVideo,
  duration,
  onPress,
  style,
  imageStyle,
}: PhotoCardProps) => {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Image 
        source={{ uri: imageUri }} 
        style={[styles.image, imageStyle]} 
        transition={120} // Clean fade-in executed directly on the native presentation thread
        recyclingKey={imageUri}
      />
      {isVideo ? (
        <View style={styles.overlay}>
          <View style={styles.videoBadge}>
            <Ionicons
              name="videocam"
              size={12}
              color="#fff"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>{formatDuration(duration)}</Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
});

export default PhotoCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    margin: 1.5,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  videoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeIcon: {
    marginRight: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
});