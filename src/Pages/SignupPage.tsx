import React from "react";
import { View, StyleSheet } from "react-native";
import SignupForm from "../Form/SignupForm";

export default function SignupPage() {
  return (
    <View style={styles.container}>
      <SignupForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});