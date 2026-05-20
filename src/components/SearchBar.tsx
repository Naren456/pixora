import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

type SearchBarProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search",
  containerStyle,
  ...textInputProps
}: SearchBarProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={20} color="#8e8e93" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
        underlineColorAndroid="transparent"
        keyboardAppearance="dark"
        {...textInputProps}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 0,
  },
});
