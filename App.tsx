import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./src/Pages/PreLogin/LoginPage";
import AuthProvider from "./src/Security/AuthProvider";
import SignupPage from "./src/Pages/PreLogin/SignupPage";
import RegisterParking from "./src/Pages/User/RegisterParkingPage";
import FindNumberPlatePage from "./src/Pages/User/FindNumberPlatePage";
import DrawerNavigator from "./src/Navigation/DrawerNavigator";
import EditUserPage from "./src/Pages/User/EditUserPage";
import ScanNumberPlatePage from "./src/Pages/p-vagt/ScanNumberPlatePage";
import ManuelScanNumberPlate from "./src/Pages/p-vagt/ManuelScanNumberPlate";
import CreateCasePage from "./src/Pages/p-vagt/CreateCasePage";
import ForgotPasswordPage from "./src/Pages/PreLogin/ForgotPassword";
import CreateCarPage from "./src/Pages/User/CreateCarPage";


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" component={ForgotPasswordPage} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterParking" component={RegisterParking} options={{ headerShown: true, title: " " }} />
          <Stack.Screen name="EditUserPage" component={EditUserPage} options={{ headerShown: true, title: " " }} />
          <Stack.Screen name="CreateCarPage" component={CreateCarPage} options={{ headerShown: true, title: " " }} />
          <Stack.Screen name="FindNumberPlate" component={FindNumberPlatePage} options={{ headerShown: true, title: " " }} />
          <Stack.Screen name="ScanNumberPlate" component={ScanNumberPlatePage} options={{ headerShown: true, title: "Scan nummerplade" }} />
          <Stack.Screen name="ManuelScanNumberPlate" component={ManuelScanNumberPlate} options={{ headerShown: true, title: "Manuel indtastning" }} />
          <Stack.Screen name="CreateCase" component={CreateCasePage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}