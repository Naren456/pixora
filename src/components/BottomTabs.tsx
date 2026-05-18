import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");
type TabName = "Pictures" | "Albums" | "Stories" | "Menu";

interface BottomTabsProps {
  currentTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export default function BottomTabs({ currentTab, onTabChange }: BottomTabsProps) {
  const tabs = [
    { name: "Pictures", icon: "images-outline", activeIcon: "images" },
    { name: "Albums", icon: "albums-outline", activeIcon: "albums" },
    { name: "Stories", icon: "sparkles-outline", activeIcon: "sparkles" },
    { name: "Menu", icon: "menu", activeIcon: "menu" },
  ] as const;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconShell, isActive && styles.activeIconShell]}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={tab.name === "Menu" ? 30 : 21}
                color={isActive ? "#ffffff" : "#b0b0b0"}
              />
            </View>
            {tab.name !== "Menu" && (
              <Text style={[styles.label, isActive && styles.activeText]}>{tab.name}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 82,
    backgroundColor: "#000000",
    borderTopWidth: 0,
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 14,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: width / 4,
  },
  iconShell: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  activeIconShell: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 18,
    color: "#b0b0b0",
    fontWeight: "600",
  },
  activeText: {
    color: "#ffffff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
