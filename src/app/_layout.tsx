import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Hides the default native header bar on all screens 
        // since we are building custom styled headers inside our components
        headerShown: false, 
      }}
    />
  );
}