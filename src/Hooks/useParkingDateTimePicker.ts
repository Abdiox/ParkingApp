// src/hooks/useParkingDateTimePicker.ts
import { useState } from "react";
import { Alert } from "react-native";
import { combineDateAndTime, validateAndSetEndDate } from "../utils/parkingHelpers";
import { pArea } from "../Services/apiFacade";

type DateTimePickerProps = {
  startTime: string;
  endTime: string;
  onTimeChange: (field: "startTime" | "endTime", value: string) => void;
  selectedPArea: pArea | null;
};

export function useParkingDateTimePicker({ startTime, endTime, onTimeChange, selectedPArea }: DateTimePickerProps) {
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const getCurrentDateTime = (): Date => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
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
      const combined = combineDateAndTime(tempStartDate, selectedTime);
      onTimeChange("startTime", combined.toISOString());
      setTempStartDate(null);
      // ressetter endTime når startTime ændres
      onTimeChange("endTime", "");
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (!startTime) {
      Alert.alert("Fejl", "Vælg venligst starttidspunkt først");
      return;
    }

    const startDateObj = new Date(startTime);

    if (selectedDate && selectedPArea) {
      validateAndSetEndDate(selectedDate, startDateObj, selectedPArea, {
        setTempEndDate,
        setShowEndDatePicker,
        setShowEndTimePicker,
      });
    } else {
      setShowEndDatePicker(false);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime && tempEndDate) {
      const combined = combineDateAndTime(tempEndDate, selectedTime);
      onTimeChange("endTime", combined.toISOString());
      setTempEndDate(null);
    }
  };

  // Funktion til at åbne start-datepicker
  const openStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  // Funktion til at åbne slut-datepicker
  const openEndDatePicker = () => {
    if (!startTime) {
      Alert.alert("Fejl", "Vælg venligst starttidspunkt først");
      return;
    }
    setShowEndDatePicker(true);
  };

  return {
    // States
    showStartDatePicker,
    showStartTimePicker,
    showEndDatePicker,
    showEndTimePicker,

    // Handlers
    handleStartDateChange,
    handleStartTimeChange,
    handleEndDateChange,
    handleEndTimeChange,

    // Helpers
    getCurrentDateTime,
    openStartDatePicker,
    openEndDatePicker,

    // Setters (hvis du har brug for dem direkte)
    setShowStartDatePicker,
    setShowStartTimePicker,
    setShowEndDatePicker,
    setShowEndTimePicker,
  };
}
