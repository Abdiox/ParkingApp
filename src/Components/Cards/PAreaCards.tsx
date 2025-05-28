import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { pArea } from "../../Services/apiFacade";

type Props = {
  pArea: pArea;
};

const PAreaCard: React.FC<Props> = ({ pArea }) => {
  if (!pArea) {
    return null; // Return null if pArea is not provided
  }
  return (
    <Card style={styles.card}>
      <Card.Title title={`Område: ${pArea.areaName}`} subtitle={`By: ${pArea.city}`} />
      <Card.Content>
        <Text style={styles.info}>Postnummer: {pArea.postalCode}</Text>
        <Text style={styles.info}>Dage tilladt parkering: {pArea.daysAllowedParking}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
    width: "100%",
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default PAreaCard;