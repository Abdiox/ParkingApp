import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PAreaCard from "../../Components/Cards/PAreaCards";
import { usePArea } from "../../Hooks/usePArea";

export default function PAreaPage() {
  const { pAreas, loading, error } = usePArea();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info om Parkeringsområder</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Indlæser...</Text>
        ) : error ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>{error}</Text>
        ) : pAreas.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen Parkeringsområder</Text>
        ) : (
          pAreas.map((area) => (
            <PAreaCard key={area.id} pArea={area} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
});