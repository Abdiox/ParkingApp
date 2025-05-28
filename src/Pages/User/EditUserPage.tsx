import React from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import UserForm from "../../Form/UserForm";
import { updateUser, getUser } from "../../Services/apiFacade";
import { useAuth } from "../../Security/AuthProvider";
import { useNavigation } from "@react-navigation/native";

export default function EditUserPage() {
  const { user, updateUserInContext } = useAuth();
  const navigation = useNavigation();

  const handleUpdate = async (updatedUser: any) => {
    try {
      const updatedUserResponse = await updateUser(updatedUser);

      await updateUserInContext(updatedUserResponse);
      Alert.alert("Success", "Dine oplysninger er opdateret!");
      navigation.navigate("Menu");
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke opdatere oplysninger.");
    }
  };

  if ( !user) {
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
        hideRentalUnit
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