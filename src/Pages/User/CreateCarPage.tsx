import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CreateCarForm from "../../Form/CreateCarForm";


export default function CreateCarPage() {
  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <CreateCarForm />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});