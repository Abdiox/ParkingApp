import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import ParkingRegisterCard from "../Components/ParkingRegisterCard";
import { useAuth } from "../Security/AuthProvider";
import { getUserParkings, Parking } from "../Services/apiFacade";

export default function Home({ navigation }: { navigation: any }) {
  const { userId } = useAuth();
  const [parkings, setParkings] = useState<Parking[]>([]);

  // Hent parkeringer (dummy eller fra API)
  useEffect(() => {
    async function fetchParkings() {
      const all = await getUserParkings(userId); // eller hvad din API hedder
      setParkings(all);
    }
    fetchParkings();
  }, [userId]);

  // Filtrér kun aktive parkeringer (slutdato i fremtiden)
  const activeParkings = parkings.filter(
    (p) => !p.endTime || new Date(p.endTime.toString()) > new Date()
  );

  // Slet handler
  const handleDelete = (parkingId: number) => {
    setParkings((prev) => prev.filter((p) => p.id !== parkingId));
    // Kald evt. API for at slette i backend også
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine aktive parkeringer</Text>
      <ScrollView style={{ width: "100%" }}>
        {activeParkings.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen aktive parkeringer</Text>
        ) : (
          activeParkings.map((parking) => (
            <ParkingRegisterCard
              key={parking.id}
              parking={parking}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("RegisterParking")}
        buttonColor="#007BFF"
        textColor="#fff"
        style={styles.addParkingButton}
        contentStyle={{ height: 50 }}
        labelStyle={{ fontSize: 18, fontWeight: "bold" }}
      >
        +
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  addParkingButton: {
    alignSelf: "center",
    borderRadius: 90,
    padding: 10,
    marginTop: 20,
    width: "30%",
    height: 50,
    marginBottom: 20,
    shadowColor: "#000",
  },
});