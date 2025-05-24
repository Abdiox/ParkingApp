import React from "react";
import { View, StyleSheet } from "react-native";
import RegisterParkingForm from "../../Form/RegisterParkingForm";

export default function RegisterParkingPage() {
  return (
    <View style={styles.container}>
      <RegisterParkingForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});