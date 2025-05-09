// AdminPage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdminPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Admin Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});