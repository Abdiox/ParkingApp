import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { hasActiveParkingByPlateNumber } from "../../Services/apiFacade";
import { useNavigation } from "@react-navigation/native";
import CaseModal from "../../Components/CaseModal"; 

export default function ManuelScanNumberPlate() {
  const navigation = useNavigation();
  const [numberPlate, setNumberPlate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCheck = async () => {
    const cleanedPlate = numberPlate.replace(/\s/g, "").toUpperCase();
    if (!cleanedPlate.match(/^[A-ZÆØÅ]{2}\d{5}$/i)) {
      alert("Ugyldigt format. Indtast en gyldig dansk nummerplade (fx AB12345)");
      return;
    }
    try {
      const hasActiveParking = await hasActiveParkingByPlateNumber(cleanedPlate);
      if (hasActiveParking) {
        alert(`Aktiv parkering fundet: ${cleanedPlate}`);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      alert("Kunne ikke tjekke aktiv parkering. Prøv igen senere.");
    }
  };

  const handleCreateCase = () => {
    setShowModal(false);
    navigation.navigate("CreateCase", {
      plateNumber: numberPlate.replace(/\s/g, "").toUpperCase(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Indtast nummerplade:</Text>
      <TextInput
        style={styles.input}
        value={numberPlate}
        onChangeText={setNumberPlate}
        placeholder="fx AB12345"
        autoCapitalize="characters"
        maxLength={7}
      />
      <Button title="Tjek" onPress={handleCheck} />
      <CaseModal
        visible={showModal}
        plate={numberPlate.replace(/\s/g, "").toUpperCase()}
        onClose={() => setShowModal(false)}
        onCreateCase={handleCreateCase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    width: 180,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "#fff"
  },
});