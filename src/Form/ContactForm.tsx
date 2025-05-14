import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

export default function ContactForm() {
  const [form, setForm] = useState({
    from: "",
    to: "support@parkingapp.com",
    subject: "",
    message: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSend = () => {
    // Ryd formularen og vis en besked
    setForm({
      from: "",
      to: "support@parkingapp.com",
      subject: "",
      message: "",
      phone: "",
    });
    Alert.alert("Message Sent", "Your message has been sent successfully!");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="From (Your Email)"
        value={form.from}
        onChangeText={(text) => handleInputChange("from", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="To"
        value={form.to}
        editable={false} // Gør feltet skrivebeskyttet
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={form.subject}
        onChangeText={(text) => handleInputChange("subject", text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Message"
        value={form.message}
        onChangeText={(text) => handleInputChange("message", text)}
        multiline={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone (Optional)"
        value={form.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});