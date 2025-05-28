import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";

export default function ForgotPasswordPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert("Fejl", "Indtast venligst din email.");
      return;
    }
    setSubmitted(true);

  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Glemt adgangskode</Text>
        <Text style={styles.infoText}>
          Indtast din email, så sender vi dig et link til at nulstille din adgangskode.
        </Text>
        <TextInput
          label="Email"
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="done"
        />
        <Button
          mode="contained"
          onPress={handleSend}
          buttonColor="#007BFF"
          textColor="#fff"
          style={styles.button}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 18, fontWeight: "bold" }}
        >
          Send
        </Button>
        {submitted && (
          <Text style={styles.successText}>
            Hvis din email findes i vores system, har vi sendt dig en mail med instruktioner.
          </Text>
        )}
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        >
          Tilbage til login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  successText: {
    color: "green",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
});