import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./src/Pages/LoginPage";
import AuthProvider from "./src/Security/AuthProvider";
import SignupPage from "./src/Pages/SignupPage";
import RegisterParking from "./src/Pages/RegisterParkingPage";
import EditParking from "./src/Pages/EditParking";
import FindNumberPlatePage from "./src/Pages/FindNumberPlatePage";
import DrawerNavigator from "./src/Navigation/DrawerNavigator";


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterParking" component={RegisterParking} options={{ headerShown: false }} />
          <Stack.Screen name="EditParking" component={EditParking} options={{ headerShown: false }} />
          <Stack.Screen name="FindNumberPlate" component={FindNumberPlatePage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}