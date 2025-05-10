import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RegisterParkingForm from "../Form/RegisterParkingForm";

export default function RegisterParking() {
  return (
    <View style={styles.container}>
    <RegisterParkingForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});