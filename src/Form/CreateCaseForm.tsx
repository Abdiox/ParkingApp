import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { User } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";

interface CreateCaseFormProps {
  plateNumber: string;
  onSubmit: (data: { description: string }) => void;
  time: string;
}

export default function CreateCaseForm({ plateNumber, onSubmit, time }: CreateCaseFormProps) {
  const [description, setDescription] = useState("");
  const { user } = useAuth();
    if (!user) {
        return null; 
    }


  return (
    <View style={styles.form}>
      <Text style={styles.label}>Nummerplade:</Text>
      <Text style={styles.value}>{plateNumber}</Text>
      <Text style={styles.label}>Tidspunkt:</Text>
      <Text style={styles.value}>{time}</Text>
      <Text style={styles.label}>PVagt:</Text>
      <Text style={styles.value}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.label}>Beskrivelse:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Beskriv sagen (fx forkert parkering, ingen billet...)"
        multiline
      />
      <Button
        title="Opret sag"
        onPress={() => onSubmit({ description })}
        disabled={!description.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: "100%", marginTop: 20 },
  label: { fontWeight: "bold", marginTop: 10 },
  value: { marginBottom: 8, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
    marginBottom: 20,
    backgroundColor: "#fff"
  },
});