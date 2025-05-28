import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Case} from "../../Services/apiFacade";

type Props = {
  caseData: Case;
  onDelete: (id: number) => void;
};

const CaseCard: React.FC<Props> = ({ caseData }) => {
  if (!caseData) {
    return null; // Return null if caseData is not provided
  }
  return (
    <Card style={styles.card}>
      <Card.Title title={`Tidspunkt for oprettelse: ${caseData.time}`} subtitle={`By: ${caseData.user.firstName}`} />
      <Card.Content>
        <Text style={styles.info}>Beskrivelse: {caseData.description}</Text>
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

export default CaseCard;