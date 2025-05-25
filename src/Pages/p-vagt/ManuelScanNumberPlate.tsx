import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { hasActiveParkingByPlateNumber } from "../../Services/apiFacade";

export default function ManuelScanNumberPlate() {
  const [numberPlate, setNumberPlate] = useState("");

  const handleCheck = async () => {
    const cleanedPlate = numberPlate.replace(/\s/g, "").toUpperCase();
    if (!cleanedPlate.match(/^[A-ZÆØÅ]{2}\d{5}$/i)) {
      Alert.alert("Ugyldigt format", "Indtast en gyldig dansk nummerplade (fx AB12345)");
      return;
    }
    try {
      const hasActiveParking = await hasActiveParkingByPlateNumber(cleanedPlate);
      if (hasActiveParking) {
        Alert.alert("Aktiv parkering fundet", `Nummerplade: ${cleanedPlate}`);
      } else {
        Alert.alert("Ingen aktiv parkering", `Nummerplade: ${cleanedPlate} har ingen aktiv parkering.`);
      }
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke tjekke aktiv parkering. Prøv igen senere.");
    }
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