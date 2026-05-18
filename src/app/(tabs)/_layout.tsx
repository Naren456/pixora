import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

type IconName = keyof typeof Ionicons.glyphMap;

const icons: Record<string, { active: IconName; inactive: IconName }> = {
  picture: { active: "images", inactive: "images-outline" },
  albums: { active: "albums", inactive: "albums-outline" },
  stories: { active: "sparkles", inactive: "sparkles-outline" },
  menu: { active: "menu", inactive: "menu-outline" },
};

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="picture"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#0b0b0d",
          borderTopWidth: 1,
          borderTopColor: "#1f1f24",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#77777f",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color }) => {
          const icon = icons[route.name] ?? icons.picture;
          return <Ionicons name={focused ? icon.active : icon.inactive} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="picture" options={{ title: "Pictures" }} />
      <Tabs.Screen name="albums" options={{ title: "Albums" }} />
      <Tabs.Screen name="stories" options={{ title: "Stories" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
    </Tabs>
  );
}
