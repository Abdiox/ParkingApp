import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { addUser } from "../Services/apiFacade";

export default function SignupForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: null,
    address: "",
    postalCode: null,
    city: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await addUser(user);
      Alert.alert("Success", `User ${response.name} created successfully!`);
      setUser({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        postalCode: "",
        city: "",
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
        placeholder="Name"
        value={user.name}
        onChangeText={(text) => handleInputChange("name", text)}
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
        placeholder="Password"
        value={user.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={user.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={user.address}
        onChangeText={(text) => handleInputChange("address", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={user.postalCode}
        onChangeText={(text) => handleInputChange("postalCode", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="City"
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