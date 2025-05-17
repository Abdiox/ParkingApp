import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import UserForm from "../Form/UserForm";
import { updateUser, getUser } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";

export default function EditUserPage() {
  const { userId } = useAuth();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hent brugerdata fra backend
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        Alert.alert("Fejl", "Kunne ikke hente brugerdata.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async (updatedUser: any) => {
    try {
      await updateUser(updatedUser);
      Alert.alert("Success", "Dine oplysninger er opdateret!");
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke opdatere oplysninger.");
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserForm
        initialUser={user}
        onSubmit={handleUpdate}
        submitLabel="Opdater"
        hidePassword 
      />
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