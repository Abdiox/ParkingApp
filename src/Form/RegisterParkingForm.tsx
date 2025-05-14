import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Security/AuthProvider";
import { getAllParkingAreas, pArea, registerParking } from "../Services/apiFacade";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import PAreaCard from "../Components/PAreaCards";

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
    parea: "", // Gem kun område-ID
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
      if (route.params?.parkingDraft) {
        setParking(route.params.parkingDraft);
        navigation.setParams({ parkingDraft: undefined });
      }
      // Hvis du kun får selectedPlate, så opdater kun plateNumber
      if (route.params?.selectedPlate) {
        setParking(prev => ({ ...prev, plateNumber: route.params.selectedPlate }));
        navigation.setParams({ selectedPlate: undefined });
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
      // Find det fulde område-objekt
      const fullPArea = pAreas.find(area => area.id === parking.parea);

      // Byg det payload, som backenden forventer
      const payload = {
        ...parking,
        parea: fullPArea, // eller evt. kun de felter backend skal bruge
      };

      await registerParking(payload);
      Alert.alert(
        "Success",
        `Parking registered for plate number: ${parking.plateNumber} in area: ${fullPArea?.areaName || parking.parea}`
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

  // Find område-objektet til visning
  const selectedPArea = pAreas.find(area => area.id === parking.parea);

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
        {errors.parea && <Text style={styles.errorText}>Parkeringsområde er påkrævet.</Text>}

        <Text style={styles.label}>Nummerplade</Text>
        <TouchableOpacity
          style={[
            styles.inputCard,
            errors.plateNumber && styles.errorInput,
          ]}
          onPress={() =>
            navigation.navigate("FindNumberPlate", {
              parkingDraft: parking,
            })
          }
        >
          <Text style={{ color: parking.plateNumber ? "#222" : "#aaa", fontSize: 17 }}>
            {parking.plateNumber ? parking.plateNumber : "Vælg nummerplade"}
          </Text>
        </TouchableOpacity>
        {errors.plateNumber && <Text style={styles.errorText}>Nummerplade er påkrævet.</Text>}

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Start</Text>
            <TouchableOpacity
              style={styles.inputCard}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={{ color: parking.startTime ? "#222" : "#aaa", fontSize: 17 }}>
                {parking.startTime ? formatDateTime(parking.startTime) : "Vælg start"}
              </Text>
            </TouchableOpacity>
            {errors.startTime && <Text style={styles.errorText}>Påkrævet</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Slut</Text>
            <TouchableOpacity
              style={styles.inputCard}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={{ color: parking.endTime ? "#222" : "#aaa", fontSize: 17 }}>
                {parking.endTime ? formatDateTime(parking.endTime) : "Vælg slut"}
              </Text>
            </TouchableOpacity>
            {errors.endTime && <Text style={styles.errorText}>Påkrævet</Text>}
          </View>
        </View>

        {/* DateTimePickers */}
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

        <View style={{ height: 32 }} /> {/* Ekstra luft før knappen */}
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