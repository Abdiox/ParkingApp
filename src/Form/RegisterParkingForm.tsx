import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Security/AuthProvider";
import { registerParking } from "../Services/apiFacade";
import { useNavigation } from "@react-navigation/native";

export default function RegisterParkingForm() {
  const { id } = useAuth();
  const navigation = useNavigation();

  const [parking, setParking] = useState({
    id: null,
    pArea: "",
    plateNumber: "",
    startTime: "",
    endTime: "",
    userId: id,
  });

  const [errors, setErrors] = useState({
    pArea: false,
    plateNumber: false,
    startTime: false,
    endTime: false,
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setParking({ ...parking, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const handleDateChange = (field: string, event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString(); // Formatér som ISO 8601
      handleInputChange(field, formattedDate);
    }
    if (field === "startTime") setShowStartPicker(false);
    if (field === "endTime") setShowEndPicker(false);
  };

  const validateForm = () => {
    const newErrors = {
      pArea: !parking.pArea,
      plateNumber: !parking.plateNumber,
      startTime: !parking.startTime,
      endTime: !parking.endTime,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    try {
      await registerParking(parking);
      Alert.alert(
        "Success",
        `Parking registered for plate number: ${parking.plateNumber} in area: ${parking.pArea}`
      );
      navigation.navigate("Menu");
      setParking({
        id: null,
        pArea: "",
        plateNumber: "",
        startTime: "",
        endTime: "",
        userId: id,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to register parking. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Parking</Text>
      <Text style={styles.label}>Parking Area</Text>
      <TextInput
        style={[styles.input, errors.pArea && styles.errorInput]}
        placeholder="Parking Area"
        value={parking.pArea || ""}
        onChangeText={(text) => handleInputChange("pArea", text)}
      />
      {errors.pArea && <Text style={styles.errorText}>Parking Area is required.</Text>}

      <Text style={styles.label}>License Plate</Text>
      <TextInput
        style={[styles.input, errors.plateNumber && styles.errorInput]}
        placeholder="License Plate"
        value={parking.plateNumber || ""}
        onChangeText={(text) => handleInputChange("plateNumber", text)}
      />
      {errors.plateNumber && <Text style={styles.errorText}>License Plate is required.</Text>}

      <Text style={styles.label}>Start Time</Text>
      <Button title={parking.startTime ? parking.startTime : "Select Start Time"} onPress={() => setShowStartPicker(true)} />
      {showStartPicker && (
        <DateTimePicker
          value={new Date()}
          mode="datetime"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => handleDateChange("startTime", event, date)}
        />
      )}
      {errors.startTime && <Text style={styles.errorText}>Start Time is required.</Text>}

      <Text style={styles.label}>End Time</Text>
      <Button title={parking.endTime ? parking.endTime : "Select End Time"} onPress={() => setShowEndPicker(true)} />
      {showEndPicker && (
        <DateTimePicker
          value={new Date()}
          mode="datetime"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => handleDateChange("endTime", event, date)}
        />
      )}
      {errors.endTime && <Text style={styles.errorText}>End Time is required.</Text>}

      <Button title="Register" onPress={handleSubmit} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});