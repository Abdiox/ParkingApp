import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";

type UserFormProps = {
  initialUser: any;
  onSubmit: (user: any) => Promise<void>;
  submitLabel?: string;
  hidePassword?: boolean;
};

export default function UserForm({ initialUser, onSubmit, submitLabel = "Gem", hidePassword = false }: UserFormProps) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleInputChange = (field: string, value: string) => {
    const numericFields = ["phoneNumber", "zipCode", "rentalUnit"];
    setUser({
      ...user,
      [field]: numericFields.includes(field) ? parseInt(value, 10) || null : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(user);
    } catch (error) {
      Alert.alert("Fejl", "Noget gik galt. Prøv igen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personoplysninger</Text>
      <TextInput
        style={styles.input}
        placeholder="Navn"
        value={user.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
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
      {!hidePassword && (
        <TextInput
          style={styles.input}
          placeholder="Kodeord"
          value={user.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Telefonnummer"
        value={user.phoneNumber ? user.phoneNumber.toString() : ""}
        onChangeText={(text) => handleInputChange("phoneNumber", text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Lejeenhed"
        value={user.rentalUnit ? user.rentalUnit.toString() : ""}
        onChangeText={(text) => handleInputChange("rentalUnit", text.replace(/[^0-9]/g, ""))}
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
        onChangeText={(text) => handleInputChange("zipCode", text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="By"
        value={user.city}
        onChangeText={(text) => handleInputChange("city", text)}
      />
      <Button title={submitLabel} onPress={handleSubmit} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, borderRadius: 4 },
});