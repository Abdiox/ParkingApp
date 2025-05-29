import React, { useState } from "react";
import { View, Image, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useAuth } from "../../Security/AuthProvider";
import LottieView from "lottie-react-native";
import LoginAnimation from "../../Components/Animations/AnimationLogin.json";

function LoginPage({ navigation }: { navigation: any }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();

  const handleSignIn = async () => {
    setIsLoading(true);
    setLoginError("");
    setLoginSuccess(false);
    try {
      if (auth) {
        await auth.signIn(user);
        setLoginSuccess(true);
        setIsLoading(false);
        navigation.navigate("Menu");
      }
    } catch (error) {
      setLoginError("Login fejlede. Kontroller venligst dine oplysninger og prøv igen.");
      setLoginSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View style={styles.lottieContainer}>
            <LottieView
              source={LoginAnimation}
              autoPlay
              loop
              style={{ width: 180, height: 180 }}
            />
            <Text style={{ marginTop: 16, fontSize: 16, color: "#222" }}>Logger ind...</Text>
          </View>
        ) : (
          <>
            <Image
              source={{
                uri: "https://i.ibb.co/btthDzX/Chat-GPT-Image-Apr-28-2025-01-54-15-PM-removebg-preview.png",
              }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>Velkommen til AM Parking!</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              onPress={() => { navigation.navigate("ForgetPassword")  }}
              style={{ alignSelf: "flex-start", marginBottom: 24 }}
            >
              <Text style={styles.forgotText}>Glemt adgangskode?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSignIn}
              buttonColor="#007BFF"
              textColor="#fff"
              style={styles.loginButton}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 18, fontWeight: "bold" }}
            >
              Log ind
            </Button>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Har du ikke en bruger? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Opret en her</Text>
              </TouchableOpacity>
            </View>

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
            {loginSuccess ? <Text style={styles.successText}>Login successful!</Text> : null}
            <Text style={styles.footerText}>AM Parking © 2025</Text>
          </>
        )}
      </ScrollView>
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
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 60,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
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
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  forgotText: {
    color: "#007BFF",
    fontSize: 15,
    textAlign: "left",
  },
  loginButton: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  signupText: {
    fontSize: 16,
    color: "#222",
  },
  signupLink: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 8,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginTop: 8,
    textAlign: "center",
  },
  footerText: {
    marginTop: 32,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default LoginPage;