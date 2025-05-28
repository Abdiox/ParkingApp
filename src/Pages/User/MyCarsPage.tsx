import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../Security/AuthProvider";
import CarCard from "../../Components/Cards/CarCard";
import { useUserCars } from "../../Hooks/useUserCars";
import { deleteCar } from "../../Services/apiFacade";
import ConfirmDialog from "../../Components/ConfirmDialog";

export default function MyCarsPage({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  if (!user) return null;
  const { cars, loading, error, refetch } = useUserCars(user?.id);

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeletePress = (carId: number) => {
    setSelectedCarId(carId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCarId !== null) {
      try {
        await deleteCar(selectedCarId);
      refetch();
      } finally {
        setShowConfirmDialog(false);
        setSelectedCarId(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine biler</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Indlæser...</Text>
        ) : error ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>{error}</Text>
        ) : cars.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen biler fundet</Text>
        ) : (
          cars.map((car) => <CarCard key={car.id} car={car} onDelete={() => handleDeletePress(car.id)} />)
        )}
      </ScrollView>
      <LinearGradient
        colors={["rgba(245,245,245,0)", "rgba(245,245,245,0.7)", "rgba(245,245,245,1)"]}
        style={styles.fabBackground}
        pointerEvents="none"
      />
      <FAB style={styles.fab} icon="plus" color="#f5f5f5" onPress={() => navigation.navigate("CreateCarPage")} size="large" customSize={76} />
      <ConfirmDialog
        visible={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        message="Er du sikker på, at du vil slette denne bil?"
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
    marginLeft: -38,
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
