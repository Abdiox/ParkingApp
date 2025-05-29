import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Car, addCar } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";
import NumberPlateLookup from "../Components/NumberPlateLookup";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import AddAnimation from "../Components/Animations/AddedAnimation.json";

export default function CreateCarForm() {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  const navigation = useNavigation();

  const [car, setCar] = useState<Car>({
    id: null,
    registrationNumber: "",
    make: "",
    model: "",
    modelYear: null,
    color: "",
    type: "",
    totalWeight: null,
    description: "",
    userId: user.id,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLookupResult = (result) => {
    setCar((prev) => ({
      ...prev,
      registrationNumber: result.registration_number || prev.registrationNumber,
      make: result.make || prev.make,
      model: result.model || prev.model,
      modelYear: result.model_year || prev.modelYear,
      color: result.color || prev.color,
      type: result.type || prev.type,
      totalWeight: result.total_weight || prev.totalWeight,
    }));
  };

  const handleInputChange = (field: keyof Car, value: string | number | null) => {
    setCar((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await addCar(car);
      // En kort timer så animationen kan ses

      setCar({
        id: null,
        registrationNumber: "",
        make: "",
        model: "",
        modelYear: null,
        color: "",
        type: "",
        totalWeight: null,
        description: "",
        userId: user.id,
      });
    } catch (error) {
      console.error("Fejl ved oprettelse af bil:", error);
      Alert.alert("Fejl", "Kunne ikke oprette bilen. Prøv igen.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate("Menu", { screen: "🚘 Mine Biler" });
      }, 2500);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Opret Bil</Text>

      {isLoading ? (
        <View style={styles.lottieContainer}>
          <LottieView source={AddAnimation} autoPlay loop style={{ width: 120, height: 120 }} />
          <Text>Opretter bil...</Text>
        </View>
      ) : (
        <>
          <NumberPlateLookup onResult={handleLookupResult} />

          <Text style={styles.label}>Mærke</Text>
          <TextInput
            style={styles.input}
            placeholder="Indtast mærke"
            value={car.make || ""}
            onChangeText={(text) => handleInputChange("make", text)}
          />

          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Indtast model"
            value={car.model || ""}
            onChangeText={(text) => handleInputChange("model", text)}
          />

          <Text style={styles.label}>Årgang</Text>
          <TextInput
            style={styles.input}
            placeholder="Indtast årgang"
            value={car.modelYear ? car.modelYear.toString() : ""}
            onChangeText={(text) => handleInputChange("modelYear", text ? parseInt(text, 10) : null)}
            keyboardType="numeric"
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
        </>
      )}
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
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 24,
  },
});
