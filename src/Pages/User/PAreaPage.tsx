import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getAllParkingAreas, pArea } from "../../Services/apiFacade";
import PAreaCard from "../../Components/Cards/PAreaCards";

export default function PAreaPage() {
  const [pAreas, setPAreas] = useState<pArea[]>([]);

  useEffect(() => {
    async function fetchParkingAreas() {
      try {
        const areas = await getAllParkingAreas();
        setPAreas(areas);
      } catch (error) {
        console.error("Error fetching parking areas:", error);
      }
    }
    fetchParkingAreas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info om Parkeringsområder</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {pAreas.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen Parkeringsområder</Text>
        ) : (
          pAreas.map((area) => (
            <PAreaCard
              key={area.id} 
              pArea={area} 
            />
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