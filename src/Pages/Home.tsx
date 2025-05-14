import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import ParkingRegisterCard from "../Components/ParkingRegisterCard";
import { useAuth } from "../Security/AuthProvider";
import { getUserParkings, Parking, deleteParking } from "../Services/apiFacade";
import ConfirmDialog from "../Components/ConfirmDialog";
import { FAB } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }: { navigation: any }) {
  const { userId } = useAuth();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParkingId, setSelectedParkingId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleDelete = async () => {
    if (selectedParkingId !== null) {
      try {
        console.log("Deleting parking with ID:", selectedParkingId);
  
        // Kald deleteParking API
        const response = await deleteParking(selectedParkingId);
  
        // Hent parkeringer igen fra backend
        const updatedParkings = await getUserParkings(userId);
        setParkings(updatedParkings);
      } catch (error) {
        console.error("Error deleting parking:", error);
      } finally {
        setShowConfirmDialog(false);
        setSelectedParkingId(null);
      }
    }
  };
    
  const confirmDelete = (parkingId: number) => {
    setSelectedParkingId(parkingId);
    setShowConfirmDialog(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine aktive parkeringer</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {activeParkings.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen aktive parkeringer</Text>
        ) : (
          activeParkings.map((parking) => (
            <ParkingRegisterCard
              key={parking.id}
              parking={parking}
              onDelete={() => confirmDelete(parking.id!)}
            />
          ))
        )}
      </ScrollView>
      <LinearGradient
        colors={[
          'rgba(245,245,245,0)',   // helt gennemsigtig i toppen
          'rgba(245,245,245,0.7)', // mere synlig midt på
          'rgba(245,245,245,1)'    // helt uigennemsigtig i bunden
        ]}
        style={styles.fabBackground}
        pointerEvents="none"
      />
      <FAB
        style={styles.fab}
        icon="plus"
        color="#f5f5f5"
        onPress={() => navigation.navigate("RegisterParking")}
        size="large"
        customSize={76}
      />
      <ConfirmDialog
        visible={showConfirmDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
        message="Er du sikker på, at du vil slette denne parkering?"
      />
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
  fab: {
    position: "absolute",
    left: "50%",
    bottom: 52,
    backgroundColor: "#007BFF",
    // backgroundColor: "#f5f5f5",
    marginLeft: -38, // Halvdelen af customSize (hvis customSize=64)
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderRadius: 50,
  },
  fabBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140, // justér så det passer til din FAB og hvor meget du vil have dækket
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

  },
});