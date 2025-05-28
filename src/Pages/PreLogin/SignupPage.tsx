import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Platform, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { addUser, checkRentalUnit, Roles } from "../../Services/apiFacade";
import { useAuth } from "../../Security/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupPage() {
  const auth = useAuth();
  const navigation = useNavigation();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    rentalUnit: "",
    address: "",
    zipCode: "",
    city: "",
    role: "USER" as Roles,
  });

  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = async () => {
    setSignupError("");
    setSignupSuccess(false);

    if (
      !user.firstName.trim() ||
      !user.lastName.trim() ||
      !user.email.trim() ||
      !user.password.trim() ||
      !user.rentalUnit.trim() ||
      !user.address.trim() ||
      !user.zipCode.trim() ||
      !user.city.trim()
    ) {
      setSignupError("Udfyld venligst alle felter.");
      return;
    }

    setLoading(true);
    try {
      const rentalUnitResponse = await checkRentalUnit(user.rentalUnit);
      if (!rentalUnitResponse) {
        setSignupError("Ugyldig lejeenhed. Prøv igen.");
        setLoading(false);
        return;
      }

      const response = await addUser(user);
      setSignupSuccess(true);
      Alert.alert("Success", `Bruger ${response.firstName} oprettet!`);
      if (auth) {
        await auth.signIn({ email: user.email, password: user.password });
        navigation.navigate("Menu");
      }
    } catch (error: any) {
      setSignupError(error.message || "Kunne ikke oprette bruger.");
    }
    setLoading(false);
  };

return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: "#f9f9f9" }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  >
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Opret bruger</Text>

        <View style={styles.inputContainer}>
          <View style={styles.nameRow}>
            <TextInput
              label="Fornavn"
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={user.firstName}
              onChangeText={text => setUser({ ...user, firstName: text })}
              returnKeyType="next"
            />
            <TextInput
              label="Efternavn"
              mode="outlined"
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              value={user.lastName}
              onChangeText={text => setUser({ ...user, lastName: text })}
              returnKeyType="next"
            />
          </View>

          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            value={user.email}
            onChangeText={text => setUser({ ...user, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            label="Adgangskode"
            mode="outlined"
            style={styles.input}
            value={user.password}
            onChangeText={text => setUser({ ...user, password: text })}
            secureTextEntry
            returnKeyType="next"
          />
          <TextInput
            label="Telefonnummer"
            mode="outlined"
            style={styles.input}
            value={user.phoneNumber}
            onChangeText={text => setUser({ ...user, phoneNumber: text })}
            keyboardType="phone-pad"
            returnKeyType="next"
          />
          <TextInput
            label="Lejeenhed"
            mode="outlined"
            style={styles.input}
            value={user.rentalUnit}
            onChangeText={text => setUser({ ...user, rentalUnit: text })}
            returnKeyType="next"
          />
          <TextInput
            label="Adresse"
            mode="outlined"
            style={styles.input}
            value={user.address}
            onChangeText={text => setUser({ ...user, address: text })}
            returnKeyType="next"
          />

          <View style={styles.cityRow}>
            <TextInput
              label="Postnummer"
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={user.zipCode}
              onChangeText={text => setUser({ ...user, zipCode: text })}
              keyboardType="numeric"
              returnKeyType="next"
            />
            <TextInput
              label="By"
              mode="outlined"
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              value={user.city}
              onChangeText={text => setUser({ ...user, city: text })}
              returnKeyType="done"
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSignup}
          buttonColor="#007BFF"
          textColor="#fff"
          style={styles.signupButton}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 18, fontWeight: "bold" }}
          loading={loading}
          disabled={loading}
        >
          Opret bruger
        </Button>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={styles.backToLogin}>Tilbage til login</Text>
        </TouchableOpacity>

        {signupError ? <Text style={styles.errorText}>{signupError}</Text> : null}
        {signupSuccess ? <Text style={styles.successText}>Bruger oprettet!</Text> : null}
        <Text style={styles.footerText}>AM Parking © 2025</Text>
      </ScrollView>

      {/* Gradient overlay i bunden */}
      <LinearGradient
        colors={["transparent", "#f9f9f9"]}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 32,
    color: "#222",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  cityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  signupButton: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  backToLogin: {
    color: "#007BFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 12,
    textAlign: "center",
    fontSize: 15,
  },
  successText: {
    color: "green",
    marginTop: 12,
    textAlign: "center",
    fontSize: 15,
  },
  footerText: {
    marginTop: 32,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  gradient: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 100,
  zIndex: 10,
},
});