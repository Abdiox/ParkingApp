import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Car } from "../Services/apiFacade";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  car: Car;
};

const CarCard: React.FC<Props> = ({ car }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <MaterialCommunityIcons name="car" size={45} color="#007BFF" style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.plate}>{car.registrationNumber}</Text>
        <Text style={styles.info}>{car.make} {car.model} • {car.color}</Text>
        <Text style={styles.infoSmall}>{car.modelYear} • {car.type}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  plate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 2,
  },
  info: {
    fontSize: 15,
    color: "#444",
  },
  infoSmall: {
    fontSize: 13,
    color: "#888",
  },
});

export default CarCard;