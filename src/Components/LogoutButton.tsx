import React from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Security/AuthProvider";

const LogoutButton = () => {
  const navigation = useNavigation();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginPage" as never }],
      });
    }
  };

  return (
    <Button
      mode="contained"
      onPress={handleLogout}
      buttonColor="#d32f2f"
      textColor="#fff"
      style={{ margin: 16 }}
      icon="logout"
    >
      Log ud
    </Button>
  );
};

export default LogoutButton;