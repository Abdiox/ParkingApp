import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Security/AuthProvider";
import { registerParking } from "../Services/apiFacade";
import { useNavigation } from "@react-navigation/native";

function formatDateTime(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString();
}

export default function RegisterParkingForm() {
  const { userId } = useAuth();
  const navigation = useNavigation();

  const [parking, setParking] = useState({
    id: null,
    pArea: "",
    plateNumber: "",
    startTime: "",
    endTime: "",
    userId: userId,
  });

  const [errors, setErrors] = useState({
    pArea: false,
    plateNumber: false,
    startTime: false,
    endTime: false,
  });

  // Picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Midlertidig dato, mens brugeren vælger
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setParking({ ...parking, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  // Android: Først vælg dato, så tid
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempStartDate(selectedDate);
      setShowStartDatePicker(false);
      setShowStartTimePicker(true);
    } else {
      setShowStartDatePicker(false);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime && tempStartDate) {
      // Kombiner dato og tid
      const combined = new Date(
        tempStartDate.getFullYear(),
        tempStartDate.getMonth(),
        tempStartDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      handleInputChange("startTime", combined.toISOString());
      setTempStartDate(null);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempEndDate(selectedDate);
      setShowEndDatePicker(false);
      setShowEndTimePicker(true);
    } else {
      setShowEndDatePicker(false);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime && tempEndDate) {
      const combined = new Date(
        tempEndDate.getFullYear(),
        tempEndDate.getMonth(),
        tempEndDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      handleInputChange("endTime", combined.toISOString());
      setTempEndDate(null);
    }
  };

  // iOS handler
  const handleDateChange = (field: string, event: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleInputChange(field, selectedDate.toISOString());
    }
    if (field === "startTime") setShowStartDatePicker(false);
    if (field === "endTime") setShowEndDatePicker(false);
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
        userId: userId,
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
      <Button
        title={parking.startTime ? formatDateTime(parking.startTime) : "Select Start Time"}
        onPress={() => {
          if (Platform.OS === "ios") setShowStartDatePicker(true);
          else setShowStartDatePicker(true);
        }}
      />
      {/* iOS: datetime, Android: date og så tid */}
      {Platform.OS === "ios" && showStartDatePicker && (
        <DateTimePicker
          value={parking.startTime ? new Date(parking.startTime) : new Date()}
          mode="datetime"
          display="inline"
          onChange={(event, date) => handleDateChange("startTime", event, date)}
        />
      )}
      {Platform.OS === "android" && showStartDatePicker && (
        <DateTimePicker
          value={parking.startTime ? new Date(parking.startTime) : new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      {Platform.OS === "android" && showStartTimePicker && (
        <DateTimePicker
          value={parking.startTime ? new Date(parking.startTime) : new Date()}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      {errors.startTime && <Text style={styles.errorText}>Start Time is required.</Text>}

      <Text style={styles.label}>End Time</Text>
      <Button
        title={parking.endTime ? formatDateTime(parking.endTime) : "Select End Time"}
        onPress={() => {
          if (Platform.OS === "ios") setShowEndDatePicker(true);
          else setShowEndDatePicker(true);
        }}
      />
      {Platform.OS === "ios" && showEndDatePicker && (
        <DateTimePicker
          value={parking.endTime ? new Date(parking.endTime) : new Date()}
          mode="datetime"
          display="inline"
          onChange={(event, date) => handleDateChange("endTime", event, date)}
        />
      )}
      {Platform.OS === "android" && showEndDatePicker && (
        <DateTimePicker
          value={parking.endTime ? new Date(parking.endTime) : new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
      {Platform.OS === "android" && showEndTimePicker && (
        <DateTimePicker
          value={parking.endTime ? new Date(parking.endTime) : new Date()}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
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