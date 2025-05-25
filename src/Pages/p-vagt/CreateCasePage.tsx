import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function CreateCasePage() {

  return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text >
              OPRET SAG
            </Text>

          </ScrollView>
        </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#555",
  },
});