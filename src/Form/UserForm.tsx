import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { addUser, Roles } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";

export default function SignupForm() {
    const navigation = useNavigation(); // Brug useNavigation her
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: null as number | null,
    rentalUnit: null as number | null,
    address: "",
    zipCode: null as number | null,
    city: "",
    role: "USER" as Roles, // Standardrolle
  });

  const auth = useAuth(); // Brug auth fra AuthProvider

  const handleInputChange = (field: string, value: string) => {
    const numericFields = ["phoneNumber", "zipCode"];
    setUser({
      ...user,
      [field]: numericFields.includes(field) ? parseInt(value, 10) || null : value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Opret bruger
      const response = await addUser(user);
      Alert.alert("Success", `User ${response.firstName} created successfully!`);

      console.log("User created:", auth + "User created:", response);
      // Log brugeren ind automatisk
      if (auth) {
        console.log("Attempting to sign in with user:", user);
        await auth.signIn({ email: user.email, password: user.password });
        Alert.alert("Success", "You are now logged in!");
        // @ts-ignore
        navigation.navigate("Menu"); // Naviger til hovedskærmen
      }

      // Nulstil formularen
      setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: null,
        rentalUnit: null,
        address: "",
        zipCode: null,
        city: "",
        role: "USER" as Roles, // Standardrolle
      });
    } catch (error) {
      console.error("Signup failed:", error);
      Alert.alert("Error", "Failed to create user. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Navn"
        value={user.firstName}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Efternavn"
        value={user.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Kodeord"
        value={user.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Telefonnummer"
        value={user.phoneNumber ? user.phoneNumber.toString() : ""}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          handleInputChange("phoneNumber", numericValue);
        }}
        keyboardType="numeric"
      />
        <TextInput
            style={styles.input}
            placeholder="Lejeenhed"
            value={user.rentalUnit ? user.rentalUnit.toString() : ""}
            onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            handleInputChange("rentalUnit", numericValue);
            }}
            keyboardType="numeric"
        />
      <TextInput
        style={styles.input}
        placeholder="Adresse"
        value={user.address}
        onChangeText={(text) => handleInputChange("address", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Postnummer"
        value={user.zipCode ? user.zipCode.toString() : ""}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          handleInputChange("zipCode", numericValue);
        }}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="By"
        value={user.city}
        onChangeText={(text) => handleInputChange("city", text)}
      />
      <Button title="Sign Up" onPress={handleSubmit} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});