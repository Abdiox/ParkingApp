import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import UserForm from "../../Form/UserForm";
import { addUser, checkRentalUnit, Roles } from "../../Services/apiFacade";
import { useAuth } from "../../Security/AuthProvider";
import { useNavigation } from "@react-navigation/native";

export default function SignupPage() {
  const auth = useAuth();
  const navigation = useNavigation();

  // Tom bruger til oprettelse
  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: null,
    rentalUnit: null,
    address: "",
    zipCode: null,
    city: "",
    role: "USER" as Roles,
  };

  const handleSignup = async (user: typeof emptyUser) => {
    try {
      // Tjekker rentalUnit er gyldig
        const rentalUnitResponse = await checkRentalUnit(user.rentalUnit);
        if (!rentalUnitResponse) {
          Alert.alert("Fejl", "Ugyldig lejeenhed. Prøv igen.");
          return;
        }

      const response = await addUser(user);
      Alert.alert("Success", `Bruger ${response.firstName} oprettet!`);
      if (auth) {
        await auth.signIn({ email: user.email, password: user.password });
        navigation.navigate("Menu");
      }
    } catch (error: any) {
      // Vis fejlbeskeden fra backend
      Alert.alert("Fejl", error.message || "Kunne ikke oprette bruger.");
    }
  };

  return (
    <View style={styles.container}>
      <UserForm
        initialUser={emptyUser}
        onSubmit={handleSignup}
        submitLabel="Sign Up"
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