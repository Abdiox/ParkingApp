import React, { useState } from "react";
import { View, Image, Text, StatusBar, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Security/AuthProvider";
// import handleSignIn from "../Security/Login";


function LoginPage({ navigation }: { navigation: any }) {
const [user, setUser] = useState({ email: "", password: "" });
const [loginError, setLoginError] = useState("");
const [loginSuccess, setLoginSuccess] = useState(false);

const auth = useAuth(); // Brug useAuth direkte i LoginPage

const handleSignIn = async () => {
  console.log("Attempting to sign in with user:", user);

  try {
    if (auth) {
      await auth.signIn(user); // Kald signIn fra AuthProvider
      setLoginSuccess(true);
      setLoginError("");
      navigation.navigate("Main"); // Naviger til "Main"-skærmen
    }
  } catch (error) {
    console.error("Sign In failed:", error);
    setLoginError("Login fejlede. Kontroller venligst dine oplysninger og prøv igen.");
    setLoginSuccess(false);
  }
};

//   const handleRedirectToSignup = () => {
//     nav.navigate("Signup"); // Naviger til signup-siden
//   };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i.ibb.co/btthDzX/Chat-GPT-Image-Apr-28-2025-01-54-15-PM-removebg-preview.png",
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Velkommen til AM Parking!</Text>
      {/* { <LottieView source={require("./assets/AccountAnimation.json")} autoPlay loop style={styles.animationSize} />} */}
      <Text style={styles.label}>Login:</Text>
      <TextInput label="Email" mode="outlined" style={styles.input} value={user.email} onChangeText={(text) => setUser({...user, email: text})} />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={user.password}
        onChangeText={(text) => setUser({...user, password: text})} 
      />
      <Button
        mode="contained"
        onPress={handleSignIn} // Kald handleSignIn direkte
        buttonColor="#007BFF"
        textColor="#fff"
      >
        Sign In
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Signup")} // Naviger til signup-siden
        textColor="#007BFF"
        style={{ marginTop: 16 }}
      >
        Opret ny bruger
      </Button>
      {loginError ? <Text style={{ color: "red" }}>{loginError}</Text> : null}
      {loginSuccess ? <Text style={{ color: "green" }}>Login successful!</Text> : null}
      <Text style={styles.footerText}>AM Parking © 2025</Text>
    </View>
  );
  
};
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  animationSize: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  footerText: {
    marginTop: 16,
    fontSize: 12,
    color: "#888",
  },
});


export default LoginPage;