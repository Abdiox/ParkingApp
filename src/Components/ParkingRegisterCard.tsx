import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Parking } from "../Services/apiFacade";

type Props = {
  parking: Parking;
  onDelete: (id: number) => void;
};

const ParkingRegisterCard: React.FC<Props> = ({ parking, onDelete }) => {    
  const navigation = useNavigation();
  const formatDateTime = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

return (
  <Card style={styles.card}>

      <Card.Title title={`Nummerplade: ${parking.plateNumber}`} subtitle={'Subtitle'} />
      <Card.Content>
        <Text style={styles.info}>Område: {parking.pArea}</Text>
        <Text style={styles.info}>Start: {formatDateTime(parking.startTime)}</Text>
        <Text style={styles.info}>Slut: {formatDateTime(parking.endTime)}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("EditParking", { parking })}
          style={styles.actionButton}
        >
          Rediger
        </Button>
        <Button
          mode="contained"
          buttonColor="#d32f2f"
          onPress={() => onDelete(parking.id)}
          style={styles.actionButton}
        >
          Slet
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionButton: {
    marginRight: 8,
  },

});

export default ParkingRegisterCard;