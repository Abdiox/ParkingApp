import React, { useState } from "react";
import { View, Image, Text, StatusBar, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Security/AuthProvider";
import handleSignIn from "../Security/Login";


function LoginPage({ navigation }) {
const [user, setUser] = useState({ email: "", password: "" });


  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  

  const handleRedirectToSignup = () => {
    navigate("/opret");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i.ibb.co/B3291RZ/9430b192-e88b-48cd-bf31-31afdc813153.jpg",
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
        onPress={() => handleSignIn(user, navigation)}
        buttonColor="#FFA500"
        textColor="#fff"
      >
        Sign In
      </Button>
      {/* {(
        <LottieView source={require("./assets/LoginSuccesfullyAnimation.json")} autoPlay loop={false} style={styles.animationSize} />
      )} */}

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