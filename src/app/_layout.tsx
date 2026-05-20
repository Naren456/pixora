import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          // Hides the default native header bar on all screens
          // since we are building custom styled headers inside our components
          headerShown: false,
        }}
      />
    </>
  );
}
