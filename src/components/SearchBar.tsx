import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search photos... (Semantic embeddings coming soon)"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        editable={false} // Keeping disabled until we integrate the model pipeline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  input: {
    height: 44,
    backgroundColor: "#f0f2f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
});