import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const menuItems = [
  { title: "Favorites", icon: "heart-outline" },
  { title: "Hidden", icon: "lock-closed-outline" },
  { title: "Recently deleted", icon: "trash-outline" },
  { title: "Settings", icon: "settings-outline" },
] as const;

export default function MenuScreen() {
  useEffect(() => {
    console.log("[Pixora][screen] Menu mounted");
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0b0b0d" />
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>
      <View style={styles.list}>
        {menuItems.map((item) => (
          <View key={item.title} style={styles.row}>
            <Ionicons name={item.icon} size={22} color="#d7d7dc" />
            <Text style={styles.rowText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={18} color="#77777f" />
          </View>
        ))}
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
  list: {
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f24",
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    flex: 1,
    color: "#f3f3f4",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 14,
  },
});
