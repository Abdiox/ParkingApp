import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Security/AuthProvider";
import { pArea, Parking, registerParking } from "../Services/apiFacade";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import PAreaCard from "../Components/Cards/PAreaCards";
import { usePArea } from "../Hooks/usePArea";
import { formatDateTime, calculateMaxEndDate } from "../utils/parkingHelpers";
import { useParkingDateTimePicker } from "../Hooks/useParkingDateTimePicker";

type FormErrors = {
  parea: boolean;
  plateNumber: boolean;
  startTime: boolean;
  endTime: boolean;
};

export default function RegisterParkingForm() {
  const { user } = useAuth();
  if (!user) return null;
  
  const navigation = useNavigation();
  const route = useRoute();
  const { pAreas } = usePArea();

  // Form state
  const [parking, setParking] = useState<Parking>({
    id: null,
    parea: null,
    plateNumber: "",
    carColor: "",
    carBrand: "",
    carModel: "",
    startTime: "",
    endTime: "",
    userId: user.id,
  });

  const [errors, setErrors] = useState<FormErrors>({
    parea: false,
    plateNumber: false,
    startTime: false,
    endTime: false,
  });

  // Find det valgte område til visning
  const selectedPArea = pAreas.find((area) => area.id === parking.parea) || null;

  // Brug vores custom hook til dato/tid
  const {
    showStartDatePicker,
    showStartTimePicker,
    showEndDatePicker,
    showEndTimePicker,
    handleStartDateChange,
    handleStartTimeChange,
    handleEndDateChange,
    handleEndTimeChange,
    getCurrentDateTime,
    openStartDatePicker,
    openEndDatePicker
  } = useParkingDateTimePicker({
    startTime: parking.startTime,
    endTime: parking.endTime,
    onTimeChange: (field, value) => handleInputChange(field, value),
    selectedPArea
  });

  // Håndter navigation params
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.parkingDraft) {
        setParking(route.params.parkingDraft);
        navigation.setParams({ parkingDraft: undefined });
      }
      if (route.params?.selectedPlate) {
        setParking((prev) => ({ ...prev, plateNumber: route.params.selectedPlate }));
        navigation.setParams({ selectedPlate: undefined });
      }
    }, [route.params])
  );

  // Handlers
  const handleInputChange = (field: keyof Parking, value: string) => {
    if (field === "parea") {
      // Reset times when area changes
      setParking((prev) => ({
        ...prev,
        [field]: value,
        startTime: "",
        endTime: "",
      }));
    } else {
      setParking((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = (): boolean => {
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
      Alert.alert("Fejl", "Udfyld venligst alle påkrævede felter");
      return;
    }

    try {
      const fullPArea = pAreas.find((area) => area.id === parking.parea);
      if (!fullPArea) {
        Alert.alert("Fejl", "Kunne ikke finde det valgte område");
        return;
      }

      const parkingData = {
        ...parking,
        parea: fullPArea,
      };

      await registerParking(parkingData);
      Alert.alert("Success", `Parkering registreret for nummerplade: ${parking.plateNumber} i område: ${fullPArea.areaName}`);
      navigation.navigate("Menu");

      // Reset form
      setParking({
        id: null,
        parea: null,
        plateNumber: "",
        carColor: "",
        carBrand: "",
        carModel: "",
        startTime: "",
        endTime: "",
        userId: user.id,
      });
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke registrere parkering. Prøv igen.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Opret parkering</Text>

        <Text style={styles.label}>Parkeringsområde</Text>
        {selectedPArea && (
          <View style={styles.cardContainer}>
            <PAreaCard pArea={selectedPArea} />
          </View>
        )}
        <View style={[styles.pickerCard, errors.parea && styles.errorInput]}>
          <Picker
            selectedValue={parking.parea}
            onValueChange={(itemValue: string) => handleInputChange("parea", itemValue)}
            style={styles.picker}
            dropdownIconColor="#007BFF"
          >
            <Picker.Item label="Vælg område" value="" />
            {pAreas.map((area) => (
              <Picker.Item key={area.id} label={area.areaName || ""} value={area.id} />
            ))}
          </Picker>
        </View>
        {errors.parea && <Text style={styles.errorText}>Parkeringsområde er påkrævet</Text>}

        <Text style={styles.label}>Nummerplade</Text>
        <TouchableOpacity
          style={[styles.inputCard, errors.plateNumber && styles.errorInput]}
          onPress={() => navigation.navigate("FindNumberPlate", { parkingDraft: parking })}
        >
          <Text style={{ color: parking.plateNumber ? "#222" : "#aaa", fontSize: 17 }}>
            {parking.plateNumber ? parking.plateNumber : "Vælg nummerplade"}
          </Text>
        </TouchableOpacity>
        {errors.plateNumber && <Text style={styles.errorText}>Nummerplade er påkrævet</Text>}

        {selectedPArea && (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Start</Text>
              <TouchableOpacity style={styles.inputCard} onPress={openStartDatePicker}>
                <Text style={{ color: parking.startTime ? "#222" : "#aaa", fontSize: 17 }}>
                  {parking.startTime ? formatDateTime(parking.startTime) : "Vælg start"}
                </Text>
              </TouchableOpacity>
              {errors.startTime && <Text style={styles.errorText}>Påkrævet</Text>}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Slut</Text>
              <TouchableOpacity
                style={[styles.inputCard, !parking.startTime && styles.disabledInput]}
                onPress={openEndDatePicker}
              >
                <Text style={{ color: parking.endTime ? "#222" : "#aaa", fontSize: 17 }}>
                  {parking.endTime ? formatDateTime(parking.endTime) : "Vælg slut"}
                </Text>
              </TouchableOpacity>
              {errors.endTime && <Text style={styles.errorText}>Påkrævet</Text>}
            </View>
          </View>
        )}

        {/* DateTimePickers */}
        {Platform.OS === "ios" && showStartDatePicker && (
          <DateTimePicker
            value={parking.startTime ? new Date(parking.startTime) : getCurrentDateTime()}
            mode="datetime"
            display="default"
            onChange={(event, date) => handleInputChange("startTime", date?.toISOString() || "")}
            minimumDate={getCurrentDateTime()} // Kan ikke vælge tid før nu
          />
        )}

        {Platform.OS === "android" && showStartDatePicker && (
          <DateTimePicker
            value={parking.startTime ? new Date(parking.startTime) : getCurrentDateTime()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            minimumDate={getCurrentDateTime()} // Kan ikke vælge dato før nu
          />
        )}

        {Platform.OS === "android" && showStartTimePicker && (
          <DateTimePicker
            value={parking.startTime ? new Date(parking.startTime) : getCurrentDateTime()}
            mode="time"
            display="default"
            onChange={handleStartTimeChange}
            minimumDate={getCurrentDateTime()} // Kan ikke vælge tid før nu
          />
        )}

        {Platform.OS === "ios" && showEndDatePicker && (
          <DateTimePicker
            value={parking.endTime ? new Date(parking.endTime) : new Date(parking.startTime)}
            mode="datetime"
            display="default"
            onChange={(event, date) => handleInputChange("endTime", date?.toISOString() || "")}
            minimumDate={new Date(parking.startTime)} // Kan ikke vælge tid før start
            maximumDate={calculateMaxEndDate(new Date(parking.startTime), selectedPArea?.daysAllowedParking || 0)} // Kan ikke vælge tid efter max dage
          />
        )}

        {Platform.OS === "android" && showEndDatePicker && (
          <DateTimePicker
            value={parking.endTime ? new Date(parking.endTime) : new Date(parking.startTime)}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={new Date(parking.startTime)} // Kan ikke vælge dato før start
            maximumDate={calculateMaxEndDate(new Date(parking.startTime), selectedPArea?.daysAllowedParking || 0)} // Kan ikke vælge dato efter max dage
          />
        )}

        {Platform.OS === "android" && showEndTimePicker && (
          <DateTimePicker
            value={parking.endTime ? new Date(parking.endTime) : new Date(parking.startTime)}
            mode="time"
            display="default"
            onChange={handleEndTimeChange}
            minimumDate={new Date(parking.startTime)} // Kan ikke vælge tid før start
            maximumDate={calculateMaxEndDate(new Date(parking.startTime), selectedPArea?.daysAllowedParking || 0)} // Kan ikke vælge tid efter max dage
          />
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Opret parkering</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// ... styles som før

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 28,
    textAlign: "center",
    marginTop: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
    marginTop: 10,
  },
  pickerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 6,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 54,
    justifyContent: "center",
  },
  picker: {
    fontSize: 17,
    color: "#222",
    width: "100%",
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 54,
    justifyContent: "center",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  disabledInput: {
    opacity: 0.5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 60,
    backgroundColor: "#007BFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardContainer: {
    marginBottom: 18,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
