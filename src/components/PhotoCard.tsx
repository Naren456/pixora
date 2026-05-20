import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageStyle,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

type PhotoCardProps = {
  title: string;
  subtitle?: string;
  imageUri: string;
  isVideo?: boolean;
  duration?: number;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PhotoCard = ({
  title,
  subtitle,
  imageUri,
  isVideo,
  duration,
  onPress,
  style,
  imageStyle,
  titleStyle,
  subtitleStyle,
}: PhotoCardProps) => {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Image source={{ uri: imageUri }} style={[styles.image, imageStyle]} />
      {isVideo ? (
        <View style={styles.overlay}>
          <View style={styles.videoBadge}>
            <Ionicons
              name="videocam"
              size={14}
              color="#fff"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>{formatDuration(duration)}</Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
};

export default PhotoCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  overlay: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  videoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 2,
  },
});
