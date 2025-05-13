import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Security/AuthProvider";
import { getAllParkingAreas, pArea, registerParking } from "../Services/apiFacade";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";

function formatDateTime(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString();
}

export default function RegisterParkingForm() {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const [pAreas, setPAreas] = useState<pArea[]>([]);
  const route = useRoute();

  const [parking, setParking] = useState({
    id: null,
    parea: "",
    plateNumber: "",
    startTime: "",
    endTime: "",
    userId: userId,
  });

  const [errors, setErrors] = useState({
    parea: false,
    plateNumber: false,
    startTime: false,
    endTime: false,
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // Fetch parking areas on mount
  useEffect(() => {
    async function fetchParkingAreas() {
      const areas = await getAllParkingAreas();
      setPAreas(areas);
    }
    fetchParkingAreas();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.selectedPlate) {
        handleInputChange("plateNumber", route.params.selectedPlate);
        // evt. ryd param igen
        navigation.setParams({ selectedPlate: undefined });
      }
      // Hvis du vil genskabe hele parking-objektet:
      if (route.params?.parkingDraft) {
        setParking(route.params.parkingDraft);
        navigation.setParams({ parkingDraft: undefined });
      }
    }, [route.params])
  );

  const handleInputChange = (field: string, value: string) => {
    setParking({ ...parking, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

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

  const validateForm = () => {
    const newErrors = {
      parea: !parking.parea,
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
        `Parking registered for plate number: ${parking.plateNumber} in area: ${parking.parea}`
      );
      navigation.navigate("Menu");
      setParking({
        id: null,
        parea: "",
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
      <View style={[styles.pickerContainer, errors.parea && styles.errorInput]}>
        <Picker
          selectedValue={parking.parea}
          onValueChange={(itemValue: pArea) => handleInputChange("parea", itemValue)}
        >
          <Picker.Item label="Select Parking Area" value="" />
          {pAreas.map((area) => (
            <Picker.Item key={area.id} label={area.areaName || ""} value={area} />
          ))}
        </Picker>
      </View>
      {errors.parea && <Text style={styles.errorText}>Parking Area is required.</Text>}

      <Text style={styles.label}>License Plate</Text>
<TouchableOpacity
  style={[
    styles.input,
    { justifyContent: "center" },
    errors.plateNumber && styles.errorInput,
  ]}
  onPress={() =>
    navigation.navigate("FindNumberPlate", {
      parkingDraft: parking,
    })
  }
>
  <Text style={{ color: parking.plateNumber ? "#222" : "#aaa", fontSize: 16 }}>
    {parking.plateNumber ? parking.plateNumber : "Vælg nummerplade"}
  </Text>
</TouchableOpacity>
{errors.plateNumber && <Text style={styles.errorText}>License Plate is required.</Text>}
      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {parking.startTime ? formatDateTime(parking.startTime) : "Select Start Time"}
        </Text>
      </TouchableOpacity>
      {Platform.OS === "ios" && showStartDatePicker && (
        <DateTimePicker
          value={parking.startTime ? new Date(parking.startTime) : new Date()}
          mode="datetime"
          display="inline"
          onChange={(event, date) => handleInputChange("startTime", date?.toISOString() || "")}
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
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {parking.endTime ? formatDateTime(parking.endTime) : "Select End Time"}
        </Text>
      </TouchableOpacity>
      {Platform.OS === "ios" && showEndDatePicker && (
        <DateTimePicker
          value={parking.endTime ? new Date(parking.endTime) : new Date()}
          mode="datetime"
          display="inline"
          onChange={(event, date) => handleInputChange("endTime", date?.toISOString() || "")}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  dateButtonText: {
    color: "#333",
    fontSize: 16,
  },
  pickerContainer: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});