import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Parking } from "../Services/apiFacade";

type Props = {
  parking: Parking;
  onDelete: (id: number) => void;
};

const logoUri = "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png";

const ParkingCard: React.FC<Props> = ({ parking, onDelete }) => {
  const navigation = useNavigation();
  const formatDateTime = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: logoUri }} style={styles.logo} />
        <View style={styles.headerRight}>
          <View style={styles.plateRow}>
            <Text style={styles.plate}>{parking.plateNumber}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.greenDot} />
              <Text style={styles.statusText}>Aktiv</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            {parking.carBrand} {parking.carModel} • {parking.carColor}
          </Text>
        </View>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.info}>Område: {parking.parea?.areaName || parking.parea} {parking.parea?.city}</Text>
        <Text style={styles.info}>Start: {formatDateTime(parking.startTime)}</Text>
        <Text style={styles.info}>Slut: {formatDateTime(parking.endTime)}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          mode="contained"
          buttonColor="#d32f2f"
          onPress={() => onDelete(parking.id)}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          Slet
        </Button>
      </View>
    </View>
  );
};

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
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logo: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    marginRight: 12,
    marginTop: 2,
  },
  headerRight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  plateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  plate: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 2,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4caf50",
    marginRight: 5,
  },
  statusText: {
    color: "#388e3c",
    fontWeight: "600",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
    marginBottom: 2,
  },
  infoSection: {
    marginLeft: 2,
    marginTop: 6,
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center", 
    marginTop: 16,           
  },
  actionButton: {
    marginLeft: 0,
    width: "70%",           
    borderRadius: 12,
  },
  actionButtonContent: {
    height: 48,               
  },
});

export default ParkingCard;