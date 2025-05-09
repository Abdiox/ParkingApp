import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "./src/Pages/Home"
import AdminPage from "./src/Pages/AdminPage";
import LoginPage from "./src/Pages/LoginPage";
import AuthProvider from "./src/Security/AuthProvider";
import SignupPage from "./src/Pages/SignupPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs({ route }: { route: { params?: { userData?: { role?: string } } } }) {
  const { userData } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = "home";
          if (route.name === "Hjem") {
            iconName = "home";
          } 

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFA500",
        tabBarInactiveTintColor: "#FFF",
        tabBarStyle: {
          backgroundColor: "#111",
        },
      })}
    >
      <Tab.Screen name="Hjem" component={Home} />

      {(userData?.role === "Admin") && <Tab.Screen name="AdminPage" component={AdminPage} />}

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="signup" component={SignupPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );

}


