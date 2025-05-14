import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ContactForm from "../Form/ContactForm";

export default function ContactPage() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.infoText}>
          For any inquiries, you can either fill out the form below or reach us directly at:
        </Text>
        <Text style={styles.email}>support@parkingapp.com</Text>
        <ContactForm />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#555",
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 20,
  },
});