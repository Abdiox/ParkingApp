import React, { useState } from "react";
import { View, Image, Text, StatusBar, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";




async function handleSignIn(user :any, navigation: any) {
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

    const auth = useAuth();  

    try {
      if (auth) {
        await auth.signIn(user);
        setLoginSuccess(true);
        setLoginError("");
        setTimeout(() => {
          navigation.navigate("Main");
        }, 3000); // Delay navigation to show the success message
      }
    } catch (error) {
      setLoginError("Login fejlede. Kontroller venligst dine oplysninger og prøv igen.");
      setLoginSuccess(false);
    }

    }
  

  export default handleSignIn;