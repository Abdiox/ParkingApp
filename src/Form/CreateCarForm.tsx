import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Car, addCar } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";

export default function CreateCarForm() {
  const { user } = useAuth();
  const [car, setCar] = useState<Car>({
    id: null,
    numberPlate: "",
    brand: "",
    model: "",
    year: null,
    color: "",
    type: "",
    description: "",
    userId: user.id,
  });

  const handleInputChange = (field: keyof Car, value: string | number | null) => {
    setCar((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!car.numberPlate || !car.brand || !car.model || !car.year || !car.color || !car.type) {
      Alert.alert("Fejl", "Alle felter undtagen beskrivelse er påkrævet.");
      return;
    }

    try {
      // Kald API'et for at tilføje bilen
      await addCar(car);
      Alert.alert("Success", "Bilen er blevet oprettet!");

      // Nulstil formularen
      setCar({
        id: null,
        numberPlate: "",
        brand: "",
        model: "",
        year: null,
        color: "",
        type: "",
        description: "",
        userId: user.id,
      });
    } catch (error) {
      console.error("Fejl ved oprettelse af bil:", error);
      Alert.alert("Fejl", "Kunne ikke oprette bilen. Prøv igen.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Opret Bil</Text>

      <Text style={styles.label}>Nummerplade</Text>
      <TextInput
        style={styles.input}
        placeholder="Indtast nummerplade"
        value={car.numberPlate || ""}
        onChangeText={(text) => handleInputChange("numberPlate", text)}
      />

      <Text style={styles.label}>Mærke</Text>
      <TextInput
        style={styles.input}
        placeholder="Indtast mærke"
        value={car.brand || ""}
        onChangeText={(text) => handleInputChange("brand", text)}
      />

      <Text style={styles.label}>Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Indtast model"
        value={car.model || ""}
        onChangeText={(text) => handleInputChange("model", text)}
      />

      <Text style={styles.label}>Farve</Text>
      <TextInput
        style={styles.input}
        placeholder="Indtast farve"
        value={car.color || ""}
        onChangeText={(text) => handleInputChange("color", text)}
      />


      <Text style={styles.label}>Beskrivelse</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Indtast beskrivelse (valgfrit)"
        value={car.description || ""}
        onChangeText={(text) => handleInputChange("description", text)}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Opret Bil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});