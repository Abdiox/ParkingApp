import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../Security/AuthProvider";
import { getUserCars, Car } from "../../Services/apiFacade";
import CarCard from "../../Components/CarCard";

export default function MyCarsPage({ navigation }: { navigation: any }) {
  const { user } = useAuth();
    if (!user) {
        return null; 
    }
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    async function fetchCars() {
      if (user) {
        const userCars = await getUserCars(user.id);
        setCars(userCars);
      }
    }
    fetchCars();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine biler</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {cars.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen biler fundet</Text>
        ) : (
          cars.map((car) => (
            <CarCard key={car.id} car={car} />
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
        onPress={() => navigation.navigate("CreateCarPage")}
        size="large"
        customSize={76}
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