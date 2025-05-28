// src/utils/parkingHelpers.ts

import { Alert } from "react-native";
import { pArea } from "../Services/apiFacade";

export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString();
};

export const calculateMaxEndDate = (startDate: Date, daysAllowed: number): Date => {
  const maxDate = new Date(startDate);
  maxDate.setDate(startDate.getDate() + daysAllowed);
  return maxDate;
};

export const calculateMinEndDate = (startDate: Date): Date => {
  return new Date(startDate);
};

type DateValidationCallbacks = {
  setTempEndDate: (date: Date) => void;
  setShowEndDatePicker: (show: boolean) => void;
  setShowEndTimePicker: (show: boolean) => void;
};

export const validateAndSetEndDate = (
  selectedDate: Date,
  startDate: Date,
  selectedPArea: pArea,
  callbacks: DateValidationCallbacks
): boolean => {
  const maxDate = calculateMaxEndDate(startDate, selectedPArea.daysAllowedParking);
  const minDate = calculateMinEndDate(startDate);

  if (selectedDate < minDate) {
    Alert.alert("Fejl", "Sluttidspunkt kan ikke være før starttidspunkt");
    return false;
  }

  if (selectedDate > maxDate) {
    Alert.alert("Fejl", `Du kan maksimalt parkere i ${selectedPArea.daysAllowedParking} dage i dette område`);
    return false;
  }

  callbacks.setTempEndDate(selectedDate);
  callbacks.setShowEndDatePicker(false);
  callbacks.setShowEndTimePicker(true);
  return true;
};

export const combineDateAndTime = (date: Date, time: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
};