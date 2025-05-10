import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import Home from "./src/Pages/Home";
import AdminPage from "./src/Pages/AdminPage";
import LoginPage from "./src/Pages/LoginPage";
import AuthProvider from "./src/Security/AuthProvider";
import SignupPage from "./src/Pages/SignupPage";
import LogoutButton from "./src/Components/LogoutButton";
import RegisterParking from "./src/Pages/RegisterParking";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#f5f5f5" }}>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <Image
          source={{ uri: "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png" }}
          style={{ width: 120, height: 120, resizeMode: "contain" }}
        />
      </View>
      <DrawerItemList {...props} />
      <LogoutButton />
    </DrawerContentScrollView>
  );
}

// Laver en separat komponent til burger-menuen, så vi kan bruge useNavigation
function BurgerMenuIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 15 }}>
      <MaterialIcons name="menu" size={32} color="#007BFF" />
    </TouchableOpacity>
  );
}

function DrawerNavigator({ route }) {
  const { userData } = route?.params || {};

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        width: "66%",
        backgroundColor: "#222",
      }}
      screenOptions={{
        drawerPosition: "right",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f9f9f9",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#007BFF",
        headerTitle: "", // Tom string, så der ikke vises noget i midten
        headerLeft: () => (
          <Image
            source={{
              uri: "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png",
            }}
            style={{ width: 80, height: 80, resizeMode: "contain", marginTop: 10 }}
          />
        ),
        headerRight: () => <BurgerMenuIcon />,
      }}
    >
      <Drawer.Screen name="Hjem" component={Home} />
      <Drawer.Screen name="AdminPage" component={AdminPage} />
      {/* {userData?.role === "Admin" && <Drawer.Screen name="AdminPage" component={AdminPage} />} */}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupPage} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterParking" component={RegisterParking} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}