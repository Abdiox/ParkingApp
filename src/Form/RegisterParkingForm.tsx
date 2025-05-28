import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../Security/AuthProvider";
import { pArea, Parking, registerParking } from "../Services/apiFacade";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import PAreaCard from "../Components/Cards/PAreaCards";
import { usePArea } from "../Hooks/usePArea";
import { formatDateTime, calculateMaxEndDate } from "../utils/parkingHelpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type FormErrors = {
  parea: boolean;
  plateNumber: boolean;
  startTime: boolean;
  endTime: boolean;
};

type PickerMode = null | "start" | "end";

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

  // DateTimePicker state
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  // Find det valgte område til visning
  const selectedPArea = pAreas.find((area) => area.id === parking.parea) || null;

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

  // DateTimePicker handlers
  const handleConfirm = (date: Date) => {
    if (pickerMode === "start") {
      handleInputChange("startTime", date.toISOString());
      handleInputChange("endTime", ""); // reset slut hvis start ændres
    } else if (pickerMode === "end") {
      handleInputChange("endTime", date.toISOString());
    }
    setPickerMode(null);
  };

  const getCurrentDateTime = (): Date => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
              <TouchableOpacity style={styles.inputCard} onPress={() => setPickerMode("start")}>
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
                onPress={() => {
                  if (!parking.startTime) {
                    Alert.alert("Fejl", "Vælg venligst starttidspunkt først");
                    return;
                  }
                  setPickerMode("end");
                }}
              >
                <Text style={{ color: parking.endTime ? "#222" : "#aaa", fontSize: 17 }}>
                  {parking.endTime ? formatDateTime(parking.endTime) : "Vælg slut"}
                </Text>
              </TouchableOpacity>
              {errors.endTime && <Text style={styles.errorText}>Påkrævet</Text>}
            </View>
          </View>
        )}

        {/* Modal DateTimePicker */}
        <DateTimePickerModal
          isVisible={pickerMode !== null}
          mode="datetime"
          date={
            pickerMode === "start"
              ? (parking.startTime ? new Date(parking.startTime) : getCurrentDateTime())
              : (parking.endTime
                  ? new Date(parking.endTime)
                  : (parking.startTime ? new Date(parking.startTime) : getCurrentDateTime()))
          }
          minimumDate={
            pickerMode === "start"
              ? getCurrentDateTime()
              : (parking.startTime ? new Date(parking.startTime) : getCurrentDateTime())
          }
          maximumDate={
            pickerMode === "end" && parking.startTime && selectedPArea
              ? calculateMaxEndDate(new Date(parking.startTime), selectedPArea.daysAllowedParking)
              : undefined
          }
          onConfirm={handleConfirm}
          onCancel={() => setPickerMode(null)}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Opret parkering</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


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