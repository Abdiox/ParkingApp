import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import ParkingCard from "../../Components/Cards/ParkingCard";
import { useAuth } from "../../Security/AuthProvider";
import { deleteParking } from "../../Services/apiFacade";
import { useUserParkings } from "../../Hooks/useUserParkings";
import ConfirmDialog from "../../Components/ConfirmDialog";
import { FAB } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';

export default function MyParkings({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  if (!user) return null;

  const { parkings, loading, error, refetch } = useUserParkings(user.id);
  const [selectedParkingId, setSelectedParkingId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (selectedParkingId !== null) {
      setIsDeleting(true);
      try {
        await deleteParking(selectedParkingId);
        refetch(); 
      } catch (error) {
        console.error("Error deleting parking:", error);
      } finally {
        // En kort timer så animationen kan ses
        setTimeout(() => {
        setIsDeleting(false);
        setShowConfirmDialog(false);
        setSelectedParkingId(null);
        }, 2000); 
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
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Indlæser...</Text>
        ) : error ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>{error}</Text>
        ) : parkings.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen aktive parkeringer</Text>
        ) : (
          parkings.map((parking) => (
            <ParkingCard
              key={parking.id}
              parking={parking}
              onDelete={() => confirmDelete(parking.id!)}
            />
          ))
        )}
      </ScrollView>
      <LinearGradient
        colors={[
          'rgba(245,245,245,0)',  
          'rgba(245,245,245,0.7)', 
          'rgba(245,245,245,1)'    
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
        isDeleting={isDeleting} 
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
    height: 140, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

  },
});