import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function StoriesScreen() {
  useEffect(() => {
    console.log("[Pixora][screen] Stories mounted");
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0b0b0d" />
      <View style={styles.header}>
        <Text style={styles.title}>Stories</Text>
      </View>
      <View style={styles.emptyState}>
        <Ionicons name="sparkles-outline" size={30} color="#d7d7dc" />
        <Text style={styles.emptyTitle}>No stories yet</Text>
        <Text style={styles.emptyText}>Your photo stories will appear here.</Text>
      </View>
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
    justifyContent: "flex-end",
  },
  title: {
    color: "#f3f3f4",
    fontSize: 34,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: "#f3f3f4",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 14,
  },
  emptyText: {
    color: "#8d8d95",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});
