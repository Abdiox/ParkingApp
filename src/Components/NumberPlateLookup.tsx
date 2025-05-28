import React, { useState } from "react";
import { View, TextInput, Button, ActivityIndicator, Text, StyleSheet } from "react-native";
import { getCarFromNumberplate } from "../Services/apiFacade";

export default function NumberPlateLookup({ onResult }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getCarFromNumberplate(search.trim());
      if (result) {
        onResult(result);
      } else {
        setError("Ingen bil fundet.");
      }
    } catch (e) {
      setError("Fejl ved opslag.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.lookupContainer}>
      <TextInput
        style={styles.input}
        placeholder="Indtast nummerplade"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="characters"
      />
      <Button title="Slå op" onPress={handleSearch} disabled={loading || !search.trim()} />
      {loading && <ActivityIndicator />}
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  lookupContainer: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff"
  },
});